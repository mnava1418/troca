import FormData from 'form-data'
import { io } from 'socket.io-client'

import { 
    connectWallet, 
    signMessage, 
    getConnectedAccount, 
    accountListener,  
    loadContracts,
    parseError,
    subscribeTrocaEvents,
    getWeb3Provider
} from '../services/ethServices'

import { 
    setAlert, 
    setIsProcessing, 
    connectUser, 
    disconnectUser,
    setUserInfo,
    setIsMember,
    connectChat
} from '../store/slices/statusSlice'

import { loadUsers } from '../store/slices/portfolioSlice'
import { loadOrderBook } from '../store/slices/exchangeSlice'

import { BACK_URLS } from '../config'
import { post, get } from '../services/networkService'
import { setChatListeners, setExchangeListeners } from '../services/socketServices'
import MyPortfolio from './MyPortfolio'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }
    
    login() {
        connectWallet(this.dispatch).then(async(account) => {
            if(account) {
                const result = await signMessage(account, this.dispatch)
                const web3 = getWeb3Provider()
                const networkId = await web3.eth.net.getId()
                if( result.isValid) {
                    this.dispatch(setIsProcessing(true))
                    
                    const response = await post(this.baseURL, '/auth/login', {signature: result.signature, account, networkId})

                    this.dispatch(setIsProcessing(false))

                    if(response.status === 200) {
                        localStorage.setItem('jwt', response.data.token)
                        await this.connect(account)
                    } else {
                        this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
                    }
                }
            } 
        })
    }

    async isConnected() {
        const token = localStorage.getItem('jwt')
        const account = await getConnectedAccount()
            
        if(token === null || account === undefined) {
            this.disconnect()
        } else {
            const response = await post(this.baseURL, '/auth/validate', {account}, token)

            if(response.status === 200) {
                await this.connect(account)
            } else {
                this.disconnect()
            }
        }
    }

    async isMember(troca, account) {
        const result = await troca.methods.members(account).call()
        return result
    }

    async isOwner(troca, account) {
        const owner = await troca.methods.ownerAccount().call()
        return owner === account
    }

    async getBalanceInfo(nft, account) {
        const mintLimit = parseInt(await nft.methods.mintLimit().call())
        const balanceOf = parseInt(await nft.methods.balanceOf(account).call())

        return {mintLimit, balanceOf}
    }

    disconnect() {
        localStorage.clear()
        this.dispatch(disconnectUser())
    }

    async connect(account) {
        const socket = this.connectToSocket()
        const {isMember, isOwner, contracts, balanceOf, mintLimit} = await this.setContracts(account, socket)
        this.dispatch(connectUser({account, isMember, isOwner, socket, balanceOf, mintLimit}))
        
        const isOnline = localStorage.getItem('isOnline')
        this.connectToChat(isOnline, socket, account)
             
        const myPortfolio = new MyPortfolio(this.dispatch)
        myPortfolio.getTokens(contracts.nft, contracts.troca)
        
        this.setListeners(account, socket)
        this.getOrderBook()
    }

    getOrderBook() {
        const token = localStorage.getItem('jwt')

        get(this.baseURL, '/exchange/orderBook', token)
        .then(response => {
            if(response.status === 200) {
                this.dispatch(loadOrderBook({orderBook: response.data.orderBook}))
            } else {
                this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
            }
        })
    }

    connectToSocket() {
        const token = localStorage.getItem('jwt')
        const socket = io(this.baseURL, {
            query: { token }
        })   

        return socket
    }

    setListeners(account, socket) {
        accountListener(account, this)
        setChatListeners(socket, this.dispatch)
        setExchangeListeners(socket, this.dispatch)
    }

    async setContracts(account, socket) {
        const contracts = await loadContracts(this.dispatch)
        let isMember, isOwner = false
        let balanceOf, mintLimit = 0
        
        if(contracts.troca && contracts.nft) {
            isMember = await this.isMember(contracts.troca, account)
            isOwner = await this.isOwner(contracts.troca, account)
            
            const balanceInfo= await this.getBalanceInfo(contracts.nft, account)
            balanceOf = balanceInfo.balanceOf
            mintLimit = balanceInfo.mintLimit
            
            subscribeTrocaEvents(contracts.troca, contracts.nft, account, this.dispatch, socket)
        }

        return {isMember, isOwner, contracts, balanceOf, mintLimit}
    }

    async getUserInfo() {
        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/user', token)

        if(response.status === 200) {
            this.dispatch(setUserInfo(response.data.userInfo))
            return response.data.userInfo
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
            return {}
        }        
    }

    async updateUserInfo(email, username, img, imgFile, setIsRegistered) {
        const token = localStorage.getItem('jwt')

        const userInfo = new FormData()
        userInfo.append('email', email)
        userInfo.append('username', username)
        userInfo.append('img', img)

        if(imgFile !== undefined) {
            userInfo.append('imgData', imgFile)
        }

        const response = await post(this.baseURL, '/user', userInfo, token, {'Content-Type': 'multipart/form-data'})

        if(response.status === 200) {
            this.dispatch(setUserInfo(response.data.userInfo))
            this.dispatch(setAlert({show: true, type: 'success', text: 'User info saved.'}))
            setIsRegistered(true)
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
        }

        this.dispatch(setIsProcessing(false))
    }

    becomeMember(account, troca, web3, fee = '1') {
        troca.methods.subscribe().send({from: account, value: web3.utils.toWei(fee, 'ether')})
        .on('transactionHash', async() => {            
            this.dispatch(setIsProcessing(false))
            const token = localStorage.getItem('jwt')

            const response = await post(this.baseURL, '/user/subscribe', {activateMembership: true}, token)

            if(response.status === 200) {
                this.dispatch(setAlert({show: true, type: 'success', text: 'Congrats! You are a new member.'}))
                this.dispatch(setIsMember(true))
            } else {
                this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
            }
        })
        .on('error', (error) => {
            console.error(error)
            const errorMessage = parseError(error)
            this.dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
            this.dispatch(setIsProcessing(false))
        })
    }

    async getAllUsers() {
        this.dispatch(setIsProcessing(true))
        
        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/user/all', token)

        if(response.status === 200) {
            this.dispatch(loadUsers(response.data.users))
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
        }

        this.dispatch(setIsProcessing(false))
    }

    connectToChat(isOnline, socket, account) {
        if(isOnline === 'true' || isOnline === true) {
            isOnline = true
        } else {
            isOnline = false
        }

        this.dispatch(connectChat({isOnline}))
        localStorage.setItem('isOnline', isOnline)
        socket.emit('connect-to-chat', account, isOnline)
    }
}

export default User

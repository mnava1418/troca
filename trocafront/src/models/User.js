import FormData from 'form-data'

import { 
    connectWallet, 
    signMessage, 
    getConnectedAccount, 
    accountListener,  
    loadContracts,
    parseError
} from '../services/ethServices'

import { 
    setAlert, 
    setIsProcessing, 
    connectUser, 
    disconnectUser,
    setUserInfo,
    setIsMember
} from '../store/slices/statusSlice'

import { BACK_URLS } from '../config'
import { post, get } from '../services/networkService'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }
    
    login() {
        connectWallet(this.dispatch).then(async(account) => {
            if(account) {
                const result = await signMessage(account, this.dispatch)
                if( result.isValid) {
                    this.dispatch(setIsProcessing(true))
                    
                    const response = await post(this.baseURL, '/auth/login', {signature: result.signature, account})

                    this.dispatch(setIsProcessing(false))

                    if(response.status === 200) {
                        localStorage.setItem('jwt', response.data.token)
                        await this.connect(account)
                    } else {
                        this.dispatch(setAlert({show: true, type: 'danger', title: 'Authentication Error', text: response.data.error}))
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

    disconnect() {
        localStorage.clear()
        this.dispatch(disconnectUser())
    }

    async connect(account) {
        const contracts = await loadContracts(this.dispatch)
        let isMember = false

        if(contracts.troca) {
            isMember = await this.isMember(contracts.troca, account)
        }
        
        this.dispatch(connectUser({account, isMember}))
        accountListener(account, this)
    }

    async getUserInfo() {
        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/user', token)

        if(response.status === 200) {
            this.dispatch(setUserInfo(response.data.userInfo))
            return response.data.userInfo
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', title: 'Error', text: response.data.error}))
            return {}
        }        
    }

    async updateUserInfo(email, username, img, imgFile) {
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
            this.dispatch(setAlert({show: true, type: 'success', title: 'Ok', text: 'User info saved.'}))
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', title: 'Error', text: response.data.error}))
        }

        this.dispatch(setIsProcessing(false))
    }

    becomeMember(account, troca, web3, fee = '1') {
        troca.methods.subscribe().send({from: account, value: web3.utils.toWei(fee, 'ether')})
        .on('transactionHash', () => {
            this.dispatch(setAlert({show: true, type: 'success', title: '', text: 'Congrats! You are a new member.'}))
            this.dispatch(setIsMember(true))
            this.dispatch(setIsProcessing(false))
        })
        .on('error', (error) => {
            console.error(error)
            const errorMessage = parseError(error)
            this.dispatch(setAlert({show: true, type: 'danger', title: '', text: errorMessage}))
            this.dispatch(setIsProcessing(false))
        })
    }
}

export default User

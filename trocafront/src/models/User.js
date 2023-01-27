import FormData from 'form-data'

import { 
    connectWallet, 
    signMessage, 
    getConnectedAccount, 
    accountListener,  
    loadContracts
} from '../services/ethServices'

import { 
    setAlert, 
    setIsProcessing, 
    connectUser, 
    disconnectUser,
    setUserInfo
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
                        this.connect(account)
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
                this.connect(account)
            } else {
                this.disconnect()
            }
        }
    }

    disconnect() {
        localStorage.clear()
        this.dispatch(disconnectUser())
    }

    connect(account) {
        this.dispatch(connectUser(account))
        accountListener(account, this)
        loadContracts(this.dispatch)
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
}

export default User

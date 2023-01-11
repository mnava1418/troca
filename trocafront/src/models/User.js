import { connectWallet, signMessage, getConnectedAccount } from '../services/ethServices'
import { BACK_URLS } from '../config'
import { post } from '../services/networkService'
import { setAlert, setIsProcessing, connectUser, disconnectUser } from '../store/slices/statusSlice'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
    }
    
    login() {
        connectWallet(this.dispatch).then(async(account) => {
            if(account) {
                const result = await signMessage(account, this.dispatch)
                if( result.isValid) {
                    this.dispatch(setIsProcessing(true))
                    const baseURL = BACK_URLS[process.env.NODE_ENV]
                    const response = await post(baseURL, '/auth/login', {signature: result.signature, account})

                    this.dispatch(setIsProcessing(false))

                    if(response.status === 200){
                        localStorage.setItem('jwt', response.data.token)
                        this.dispatch(connectUser(account))
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
            console.log('si toy')
        }
    }

    disconnect() {
        localStorage.clear()
        this.dispatch(disconnectUser())
    }
}

export default User
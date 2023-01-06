import { connectWallet, signMessage } from '../services/ethServices'
import { BACK_URLS } from '../config'
import { post } from '../services/networkService'
import { setAlert, setIsProcessing } from '../store/slices/statusSlice'

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
                    } else {
                        this.dispatch(setAlert({show: true, type: 'danger', title: 'Authentication Error', text: response.data.error}))
                    }
                }
            } 
        })
    }
}

export default User
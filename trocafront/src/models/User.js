import { connectWallet, signMessage } from '../services/ethServices'
import { BACK_URLS } from '../config'
import { post } from '../services/networkService'
import { setAlert } from '../store/slices/statusSlice'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
    }
    
    login() {
        connectWallet(this.dispatch).then(async(account) => {
            if(account) {
                const result = await signMessage(account, this.dispatch)
                if( result.isValid) {
                    const baseURL = BACK_URLS[process.env.NODE_ENV]

                    post(baseURL, '/auth/login', {signature: result.signature, account})
                    .then( response => {
                        if(response.status === 200){
                            this.dispatch(setAlert({show: true, type: 'success', title: 'OK!', text: ''}))
                        } else {
                            this.dispatch(setAlert({show: true, type: 'danger', title: 'Authentication Error', text: response.data.error}))
                        }
                    })
                }
            } 
        })
    }
}

export default User
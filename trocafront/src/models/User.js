import { connectWallet, signMessage } from '../services/ethServices'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
    }
    
    login() {
        connectWallet(this.dispatch).then(async(account) => {
            if(account) {
                const result = await signMessage(account, this.dispatch)
                if( result.isValid) {
                    console.log('vamoa hacer el login', {...result, account})
                }
            } 
        })
    }
}

export default User
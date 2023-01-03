import { connectWallet } from '../services/ethServices'

class User {
    constructor (_dispatch) {
        this.dispatch = _dispatch
    }
    login() {
        connectWallet(this.dispatch).then(account => {
            if(account) {
                console.log(account)
            } 
        })
    }
}

export default User
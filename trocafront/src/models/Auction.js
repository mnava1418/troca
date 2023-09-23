import { BACK_URLS } from '../config'
import { get } from '../services/networkService'
import { setLiveAuctions } from '../store/slices/auctionSlice'

class Auction {
    constructor (_dispatch) {
        this.dispatch = _dispatch
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }

    getLiveAuctions() {
        const token = localStorage.getItem('jwt')

        get(this.baseURL, '/auction', token)
        .then(response => {
            if(response.status === 200) {                                
                const {liveAuctions, userAuction} = response.data
                this.dispatch(setLiveAuctions({liveAuctions, userAuction}))
            }
        })
    }
}

export default Auction
import { get } from '../services/networkService'
import { BACK_URLS } from '../config'

import { setIsProcessing, setAlert } from '../store/slices/statusSlice'
import { loadTokens } from '../store/slices/portfolioSlice'

class MyPortfolio {
    constructor (dispatch) {
        this.dispatch = dispatch
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }

    async getTokens() {
        this.dispatch(setIsProcessing(true))
        
        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/portfolio', token)

        if(response.status === 200) {
            this.dispatch(loadTokens(response.data.tokens))
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
        }

        this.dispatch(setIsProcessing(false))
    }
}

export default MyPortfolio
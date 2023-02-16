import FormData from 'form-data'

import { setAlert, setIsProcessing } from '../store/slices/statusSlice'
import { BACK_URLS } from '../config'
import { post } from '../services/networkService'

class Exchange {
    constructor (_dispatch, _troca, _nft) {
        this.dispatch = _dispatch
        this.troca = _troca
        this.nft = _nft
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }

    async createItem(title, description, price, royalties, imgFile) {
        const token = localStorage.getItem('jwt')

        const userInfo = new FormData()
        userInfo.append('title', title)
        userInfo.append('description', description)
        userInfo.append('price', price)
        userInfo.append('royalties', royalties)
        userInfo.append('imgData', imgFile)

        const response = await post(this.baseURL, '/eth/metaData', userInfo, token, {'Content-Type': 'multipart/form-data'})

        if(response.status === 200) {
            this.dispatch(setAlert({show: true, type: 'success', text: response.data.message}))
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
        }

        this.dispatch(setIsProcessing(false))
    }
}

export default Exchange
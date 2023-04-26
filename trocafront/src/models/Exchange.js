import FormData from 'form-data'

import { setAlert, setIsProcessing } from '../store/slices/statusSlice'
import { showExchange, updateCatalog } from '../store/slices/exchangeSlice'
import { BACK_URLS, BID_STATUS } from '../config'
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

    prepareNewBid(seller, sellerId, sellerData, buyer) {
        const orderId = Date.now()
        const order = {id: orderId, seller, sellerId, sellerData, buyer, buyerData: undefined, price: 0.0, status: BID_STATUS.new}
        this.dispatch(showExchange({show: true, order}))
    }

    async getTokensByAccount(account) {
        const tokens = []

        const tokenId = await this.nft.methods.tokenId().call()
        .then(result => parseInt(result))
        
        if(tokenId !== 0) {
            for(let i = 1; i <= tokenId; i++) {
                const owner = await this.nft.methods.ownerOf(i).call()
                const isListed = await this.nft.methods.getApproved(i).call()
                .then( operator => operator === this.troca._address)

                if(isListed && owner === account) {
                    const uri = await this.nft.methods.tokenURI(i).call()
                    const image = await (await fetch(uri)).json().then(data => data.image)
                    tokens.push({id: i, image})
                }
            }
        } 

        this.dispatch(updateCatalog({account, tokens}))
    }
}

export default Exchange
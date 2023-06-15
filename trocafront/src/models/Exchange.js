import FormData from 'form-data'

import { setAlert, setIsProcessing } from '../store/slices/statusSlice'
import { showExchange, updateOrderStatus, switchTokens } from '../store/slices/exchangeSlice'
import { BACK_URLS, BID_STATUS } from '../config'
import { post } from '../services/networkService'
import { parseError } from '../services/ethServices'

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

    prepareNewBid(seller, sellerTokenId, buyer) {
        const orderId = Date.now()
        const order = {id: orderId, seller, sellerTokenId, buyer, buyerTokenId: 0, price: 0.0, status: BID_STATUS.new}
        this.dispatch(showExchange({show: true, order}))
    }

    updateBid(socket, order, status, isBuyer) {
        order.status = status
        const receiver = isBuyer ? order.seller : order.buyer
        this.dispatch(updateOrderStatus({status: order.status}))
        socket.emit('update-bid', order, receiver)
    }

    confirmOrder(socket, order, isBuyer, setAnimation) {
        this.troca.methods.switchToken(this.nft._address, order.seller, order.sellerTokenId, order.buyerTokenId).send({from: order.buyer})
        .on('transactionHash', () => {
            this.dispatch(setAlert({show: true, type: 'warning', text: 'Please wait for the transaction to be confirmed.'}))
            this.updateBid(socket, order, BID_STATUS.complete, isBuyer)
            setAnimation('exchange-item-animation')

            setTimeout(() => {
                this.dispatch(switchTokens())
            }, 500)
        })
        .on('error', (error) => {
            console.error(error)
            const errorMessage = parseError(error)
            this.dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
        })
    }

    async validateOwnership(socket, order, isBuyer) {
        const sellerTokenIdOwner = await this.nft.methods.ownerOf(order.sellerTokenId).call()
        const buyerTokenIdOwner = await this.nft.methods.ownerOf(order.buyerTokenId).call()
        
        const isSellerTokenListed = await this.nft.methods.getApproved(order.sellerTokenId).call()
        .then( operator => operator === this.troca._address)

        const isBuyerTokenListed = await this.nft.methods.getApproved(order.buyerTokenId).call()
        .then( operator => operator === this.troca._address)

        if(sellerTokenIdOwner !== order.seller || buyerTokenIdOwner !== order.buyer || !isSellerTokenListed || !isBuyerTokenListed) {
            this.updateBid(socket, order, BID_STATUS.reject, isBuyer)
            return false
        } else {
            return true
        }
    }
}

export default Exchange
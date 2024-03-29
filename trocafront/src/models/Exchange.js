import { setAlert } from '../store/slices/statusSlice'
import { showExchange, updateOrderStatus } from '../store/slices/exchangeSlice'
import { BACK_URLS, BID_STATUS } from '../config'
import { parseError } from '../services/ethServices'

class Exchange {
    constructor (_dispatch, _troca, _nft, _networkId) {
        this.dispatch = _dispatch
        this.troca = _troca
        this.nft = _nft
        this.networkId = _networkId
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }    

    prepareNewBid(seller, sellerTokenId, buyer) {
        const orderId = Date.now()
        const order = {id: orderId, seller, sellerTokenId, buyer, buyerTokenId: 0, price: 0.0, status: BID_STATUS.new}
        this.dispatch(showExchange({show: true, order}))
    }

    updateBid(socket, order, status, isBuyer) {
        order.status = status
        order.networkId = this.networkId
        const receiver = isBuyer ? order.seller : order.buyer
        this.dispatch(updateOrderStatus({status: order.status}))
        socket.emit('update-bid', order, receiver)
    }

    confirmOrder(socket, order, isBuyer, web3) {
        this.troca.methods.switchToken(this.nft._address, order.seller, order.sellerTokenId, order.buyerTokenId).send({from: order.buyer, value: web3.utils.toWei(order.price.toString(), 'ether')})
        .on('transactionHash', () => {
            this.updateBid(socket, order, BID_STATUS.complete, isBuyer)            
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
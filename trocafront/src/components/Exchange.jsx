import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import BidItem from './BidItem'
import ExchangeModel from '../models/Exchange'
import useWeb3 from '../hooks/useWeb3'

import { showExchange, bidOrderSelector, orderBookSelector, updateOrderPrice } from '../store/slices/exchangeSlice'
import { connectionStatusSelector, setAlert } from '../store/slices/statusSlice'
import { BID_STATUS, BID_ACTIONS } from '../config'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function Exchange() {
    const dispatch = useDispatch()
    const { account, socket } = useSelector(connectionStatusSelector)
    const { nft, troca, web3} = useWeb3()
    
    const orderBook = useSelector(orderBookSelector)
    const order = useSelector(bidOrderSelector)
    const {seller, sellerTokenId, buyer, buyerTokenId, price, status} = order

    const isBuyer = buyer === account
    const exchange = new ExchangeModel(dispatch, troca, nft)

    const [animation, setAnimation] = useState('')

    useEffect(() => {
        document.getElementById('exchangePrice').value = (price !== 0 ? price.toString() : '')
    }, [price])

    const getActionBtn = () => {
        if(status === BID_STATUS.new && isBuyer) {
            return(<Button variant="primary" onClick={() => {validateOrder(BID_ACTIONS.create)}}>Place Bid</Button>)
        } else if (status === BID_STATUS.seller && !isBuyer) {
            return(<Button variant="primary" onClick={() => {validateOrder(BID_ACTIONS.accept)}}>Accept</Button>)
        } else if(status === BID_STATUS.accept && isBuyer) {
            return(<Button variant="primary" onClick={() => {validateOrder(BID_ACTIONS.confirm)}}>Confirm</Button>)
        }else {
            return(<></>)
        }
    }

    const validateOrder = async (action) => {
        let orderValid = true
        let validationError = 'Both tokens are mandatory.'

        if(price < 0) {
            orderValid = false
            validationError = 'Price must be positive.'
        } else if(buyerTokenId === 0 || sellerTokenId === 0) {
            orderValid = false
        } else if(action === BID_ACTIONS.create && !validateToken(sellerTokenId, 'sellerTokenId')) {
            orderValid = false
            validationError = `You have an open bid for token #${sellerTokenId}.`
        } else if(action === BID_ACTIONS.create && !validateToken(buyerTokenId, 'buyerTokenId')) {
            orderValid = false
            validationError = `Your token #${buyerTokenId} is part of an open bid.`
        }

        if(action !== BID_ACTIONS.create && action !== BID_ACTIONS.reject) {
            const isOwnershipValid = await exchange.validateOwnership(socket, {...order}, isBuyer)

            if( !isOwnershipValid ) {
                orderValid = false
                validationError = `Your order is no longer valid. Auto rejecting.`
            }
        }

        if(orderValid) {
            switch (action) {
                case BID_ACTIONS.create:
                    exchange.updateBid(socket, {...order}, BID_STATUS.seller, isBuyer)
                    break;
                case BID_ACTIONS.reject:
                    exchange.updateBid(socket, {...order}, BID_STATUS.reject, isBuyer)
                    break;
                case BID_ACTIONS.update:
                    const currentStatus = isBuyer ? BID_STATUS.seller : BID_STATUS.buyer
                    exchange.updateBid(socket, {...order}, currentStatus, isBuyer)
                    break;
                case BID_ACTIONS.accept:
                    exchange.updateBid(socket, {...order}, BID_STATUS.accept, isBuyer)
                    break;
                case BID_ACTIONS.confirm:
                    exchange.confirmOrder(socket, {...order}, isBuyer, setAnimation, web3)
                    break;
                default:
                    break;
            }
        } else {
            dispatch(setAlert({show: true, type: 'danger', text: `Invalid Bid. ${validationError}`}))
        }
    }

    const validateToken = (token, key) => {
        const myOpenOrders = orderBook.filter(element => (element.buyer === account))

        for (const openOrder of myOpenOrders) {
            if(openOrder[key] === token && (openOrder.status === BID_STATUS.buyer || openOrder.status === BID_STATUS.seller)) {
                return false
            }
        }

        return true
    }

    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => {dispatch(showExchange({show: false}))}}>
            <div className='exchange-container' onClick={(e) => {e.stopPropagation()}}>
                <div className='exchange-contents'>
                    <BidItem actor={buyer} tokenId={buyerTokenId} animation={animation} canUpdate={status === BID_STATUS.new || ((status === BID_STATUS.seller || status === BID_STATUS.pending) && !isBuyer) || ((status === BID_STATUS.buyer || status === BID_STATUS.pending) && isBuyer)} />
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-info'>                        
                        <Form id='exchangeForm' autoComplete='off'>
                            <Form.Group controlId="exchangePrice" style={{marginLeft: '0px'}}>
                                <Form.Control
                                    className='exchange-price'
                                    type='number'
                                    step='0.00001'
                                    min='0'
                                    placeholder="0 ETH"
                                    onChange={(e) => dispatch(updateOrderPrice(e.target.value))}
                                />
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid price.</Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                        <br />
                        <div className={`exchange-item-bg bg-img bg-im-contain ${status === BID_STATUS.buyer || status === BID_STATUS.seller || status === BID_STATUS.pending ? 'nft-card-back-animate' : ''}`} />
                    </div>
                    <BidItem actor={seller} tokenId={sellerTokenId} animation={animation} canUpdate={false} />
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{marginTop: '40px'}}>
                    {status === BID_STATUS.new || status === BID_STATUS.reject || status === BID_STATUS.complete ? <></> : <Button variant="outline-light" style={{marginRight: '40px'}} onClick={() => {validateOrder(BID_ACTIONS.reject)}}>Reject</Button>}
                    {getActionBtn()}
                    {((status === BID_STATUS.seller || status === BID_STATUS.pending) && !isBuyer) || ((status === BID_STATUS.buyer || status === BID_STATUS.pending) && isBuyer)  ? <Button variant="outline-light" style={{marginLeft: '40px'}} onClick={() => {validateOrder(BID_ACTIONS.update)}}>Update</Button> : <></> }
                </div>
            </div>
        </section>
    )
}

export default Exchange
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import BidItem from './BidItem'
import ExchangeModel from '../models/Exchange'
import useWeb3 from '../hooks/useWeb3'

import { showExchange, bidOrderSelector } from '../store/slices/exchangeSlice'
import { connectionStatusSelector, setAlert } from '../store/slices/statusSlice'
import { BID_STATUS, BID_ACTIONS } from '../config'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function Exchange() {
    const dispatch = useDispatch()
    const { account, socket } = useSelector(connectionStatusSelector)
    const { nft, troca} = useWeb3()
    
    const order = useSelector(bidOrderSelector)
    const {seller, sellerTokenId, buyer, buyerTokenId, price, status} = order

    const isBuyer = buyer === account
    const exchange = new ExchangeModel(dispatch, troca, nft)

    const getActionBtn = () => {
        if(status === BID_STATUS.new && isBuyer) {
            return(<Button variant="primary" onClick={() => {validateOrder(BID_ACTIONS.create)}}>Place Bid</Button>)
        } else {
            return(<></>)
        }
    }

    const validateOrder = (action) => {
        let orderValid = true

        if(buyerTokenId === 0) {
            orderValid = false
        } else if(sellerTokenId === 0) {
            orderValid = false
        }

        if(orderValid) {
            switch (action) {
                case BID_ACTIONS.create:
                    exchange.placeBid(socket, {...order})
                    break;
                case BID_ACTIONS.reject:
                    exchange.reject(socket, {...order}, isBuyer)
                    break;                
                default:
                    break;
            }
        } else {
            dispatch(setAlert({show: true, type: 'danger', text: 'Ivalid Bid. Both tokens are mandatory.'}))
        }
    }

    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => {dispatch(showExchange({show: false}))}}>
            <div className='exchange-container' onClick={(e) => {e.stopPropagation()}}>
                <div className='exchange-contents'>
                    <BidItem actor={buyer} tokenId={buyerTokenId} canUpdate={true} />
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-info'>                        
                        <h4>{price} ETH</h4>
                        <div className={`exchange-item-bg bg-img bg-im-contain ${status === BID_STATUS.buyer || status === BID_STATUS.seller ? 'nft-card-back-animate' : ''}`} />
                    </div>
                    <BidItem actor={seller} tokenId={sellerTokenId} canUpdate={false} />
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{marginTop: '40px'}}>
                    {status === BID_STATUS.new || status === BID_STATUS.reject ? <></> : <Button variant="outline-light" style={{marginRight: '40px'}} onClick={() => {validateOrder(BID_ACTIONS.reject)}}>Reject</Button>}
                    {getActionBtn()}
                    {(status === BID_STATUS.seller && !isBuyer) || (status === BID_STATUS.buyer && isBuyer)  ? <Button variant="outline-light" style={{marginLeft: '40px'}}>Update</Button> : <></> }
                </div>
            </div>
        </section>
    )
}

export default Exchange
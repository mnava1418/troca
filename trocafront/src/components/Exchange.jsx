import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import BidItem from './BidItem'

import { showExchange, bidOrderSelector } from '../store/slices/exchangeSlice'
import { connectionStatusSelector } from '../store/slices/statusSlice'
import { BID_STATUS } from '../config'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function Exchange() {
    const dispatch = useDispatch()
    const { account } = useSelector(connectionStatusSelector)
    
    const order = useSelector(bidOrderSelector)
    const {seller, sellerTokenId, buyer, buyerTokenId, price, status} = order

    const isBuyer = buyer === account

    const getActionBtn = () => {
        if(status === BID_STATUS.new && isBuyer) {
            return(<Button variant="primary">Place Bid</Button>)
        } else {
            return(<></>)
        }
    }

    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => {dispatch(showExchange({show: false}))}}>
            <div className='exchange-container' onClick={(e) => {e.stopPropagation()}}>
                <div className='exchange-contents'>
                    <BidItem actor={buyer} tokenId={buyerTokenId} canUpdate={true} />
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-info'>                        
                        <h4>{price} ETH</h4>
                        <div className='exchange-item-bg bg-img bg-im-contain' />
                    </div>
                    <BidItem actor={seller} tokenId={sellerTokenId} canUpdate={false} />
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{marginTop: '40px'}}>
                    {status === BID_STATUS.new ? <></> : <Button variant="outline-light" style={{marginRight: '40px'}}>Reject</Button>}
                    {getActionBtn()}
                    {status === BID_STATUS.new ? <></> : <Button variant="outline-light" style={{marginLeft: '40px'}}>Update</Button>}
                </div>
            </div>
        </section>
    )
}

export default Exchange
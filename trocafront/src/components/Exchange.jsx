import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
//import Alert from 'react-bootstrap/Alert'
import BidItem from './BidItem'

import { showExchange, bidOrderSelector } from '../store/slices/exchangeSlice'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function Exchange() {
    const dispatch = useDispatch()
    const order = useSelector(bidOrderSelector)
    const {seller, sellerData, buyer, buyerData, price} = order

    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => {dispatch(showExchange({show: false}))}}>
            <div className='exchange-container' onClick={(e) => {e.stopPropagation()}}>
                <div className='exchange-contents'>
                    <BidItem actor={buyer} imgData={buyerData} />
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-info'>                        
                        <h4>{price} ETH</h4>
                        <div className='exchange-item-bg bg-img bg-im-contain' />
                    </div>
                    <BidItem actor={seller} imgData={sellerData} />
                </div>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{marginTop: '40px'}}>
                    <Button variant="outline-light" style={{marginRight: '40px'}}>Reject</Button>
                    <Button variant="primary">Accept</Button>
                    <Button variant="outline-light" style={{marginLeft: '40px'}}>Update</Button>
                </div>
            </div>
        </section>
    )
}

//<Alert key='exchangeAlert' variant='success'>Exchange!</Alert>

export default Exchange
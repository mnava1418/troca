import { useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import { showExchange } from '../store/slices/exchangeSlice'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function Exchange() {
    const dispatch = useDispatch()

    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => {dispatch(showExchange({show: false}))}}>
            <div className='exchange-container' onClick={(e) => {e.stopPropagation()}}>
                <div className='exchange-contents'>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <h4>@Buyer</h4>
                        <div className='d-flex flex-column justify-content-center align-items-center exchange-item'>
                            <div className='exchange-item-bg bg-img bg-im-contain' />
                        </div>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-info'>
                        <Alert key='exchangeAlert' variant='success'>Exchange!</Alert>
                        <h4>3 ETH</h4>
                        <div className='exchange-item-bg bg-img bg-im-contain' />
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <h4>@Seller</h4>
                        <div className='d-flex flex-column justify-content-center align-items-center exchange-item'>
                            <div className='exchange-item-bg bg-img bg-im-contain' />
                        </div>
                    </div>
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

export default Exchange
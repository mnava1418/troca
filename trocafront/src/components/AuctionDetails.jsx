import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { currentAuctionSelector, liveAuctionsSelector, selectAuction } from '../store/slices/auctionSlice'
import { connectionStatusSelector } from '../store/slices/statusSlice';
import { AUCTION_STATUS, AUCTION_ACTIONS } from '../config';

import AuctionElement from './AuctionElement'
import NFTImage from './NFTImage'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AuctionDetails() {
    const dispatch = useDispatch()
    const currentAuction = useSelector(currentAuctionSelector)
    const {liveAuctions, userAuction} = useSelector(liveAuctionsSelector)
    const { account, socket } = useSelector(connectionStatusSelector)
    const [showNFT, setShowNFT] = useState(false)
    const [bidPrice, setBidPrice] = useState(0)
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)       

        if(Object.keys(liveAuctions).length > 0 && urlParams.has('id')) {            
            dispatch(selectAuction(urlParams.get('id')))
        }
        // eslint-disable-next-line
    }, [liveAuctions])

    const handleSubmit = (e, action) => {
        e.stopPropagation()
        
        if(action === AUCTION_ACTIONS.join) {            
            socket.emit('join-auction', currentAuction.id, currentAuction.users)
        } else if(action === AUCTION_ACTIONS.start) {
            socket.emit('start-auction', currentAuction.id, currentAuction.price)
        } else if(action === AUCTION_ACTIONS.update) {            
            submitPrice()
        }
    }

    const submitPrice = () => {        
        const form = document.getElementById('auctionForm')
        if (form.checkValidity()) {            
            document.getElementById('mintPrice').value = ''
            socket.emit('price-update-auction', currentAuction.id, bidPrice)
            setValidated(false);
        } else {
            setValidated(true);
        }
    }

    const getActionBtn = () => {
        if(account === currentAuction.account && currentAuction.status === AUCTION_STATUS.new && currentAuction.users > 0) {
            return(<Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {handleSubmit(e, AUCTION_ACTIONS.start)}}>Start</Button>)
        }if(!userAuction && account !== currentAuction.account && currentAuction.status === AUCTION_STATUS.new) {
            return(<Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {handleSubmit(e, AUCTION_ACTIONS.join)}}>Join</Button>)
        }if(userAuction === currentAuction.id && account !== currentAuction.account && currentAuction.status === AUCTION_STATUS.live) {
            return(
                <div className='d-flex flex-row justify-content-center align-items-center auction-form form-container-dark'>
                    <Form id='auctionForm' noValidate validated={validated} autoComplete='off'>
                        <Form.Group controlId="mintPrice" style={{marginLeft: '0px', width: '130px'}}>
                            <Form.Control                                
                                required
                                type='number'
                                step='0.00001'
                                min={currentAuction.price}
                                placeholder={currentAuction.price}                                
                                onChange={(e) => setBidPrice(e.target.value)}
                                onClick={(e) => {e.stopPropagation()}}
                                style={{backgroundColor: 'transparent'}}
                            />
                        </Form.Group>  
                    </Form>
                    <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {handleSubmit(e, AUCTION_ACTIONS.update)}}>Submit</Button>
                </div> 
            )
        } else {
            return(<></>)
        }
    }

    const getAuctionMessages = () => {
        let messages = []
        
        if(currentAuction.messages) {
            messages = Object.values(currentAuction.messages).slice().reverse()
        }

        return(
            <div className='d-flex flex-column-reverse justify-content-start align-items-end auction-details-messages'>
                {messages.map((currMessage, index) => {
                    return(
                        <div key={index} className="message-container">
                            <p className="message-text">{currMessage.text}</p>
                        </div> 
                    )
                })}
            </div>
        )
    }

    const showDetails = () => {
        return(
            <>
            <div className='d-flex flex-column justify-content-start align-items-center' style={{width: '100%', height: '100%'}}>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{width: '100%'}} onClick={() => setShowNFT(true)}>
                    <AuctionElement auction={currentAuction} subtitle={`${currentAuction.users} active users`} />
                    {getActionBtn()}
                </div>
                {getAuctionMessages()}
            </div>
            {showNFT && currentAuction ? <NFTImage image={currentAuction.image} close={setShowNFT}/> : <></>}
            </>
        )
    }

    const showDefault = () => {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{width: '100%', height: '100%'}}>
                <div className='bg-img bg-im-contain auction-details-default'/>
            </div>
        )
    }

    return(
        <div className='d-flex flex-column justify-content-start align-items-center auction-details'>
            {!currentAuction ? showDefault() : showDetails()}
        </div>
    )
}

export default AuctionDetails

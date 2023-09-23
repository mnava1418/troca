import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { currentAuctionSelector, liveAuctionsSelector, selectAuction } from '../store/slices/auctionSlice'
import { connectionStatusSelector } from '../store/slices/statusSlice';
import { AUCTION_STATUS, AUCTION_ACTIONS } from '../config';

import AuctionElement from './AuctionElement'
import NFTImage from './NFTImage'
import Button from 'react-bootstrap/Button';

function AuctionDetails() {
    const dispatch = useDispatch()
    const currentAuction = useSelector(currentAuctionSelector)
    const {liveAuctions, userAuction} = useSelector(liveAuctionsSelector)
    const { account, socket } = useSelector(connectionStatusSelector)
    const [showNFT, setShowNFT] = useState(false)

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
        }
    }

    const getActionBtn = () => {
        if(account === currentAuction.account && currentAuction.status === AUCTION_STATUS.new && currentAuction.users > 0) {
            return(<Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {handleSubmit(e, AUCTION_ACTIONS.start)}}>Start</Button>)
        }if(!userAuction && account !== currentAuction.account && currentAuction.status === AUCTION_STATUS.new) {
            return(<Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {handleSubmit(e, AUCTION_ACTIONS.join)}}>Join</Button>)
        } else {
            return(<></>)
        }
    }

    const showDetails = () => {
        //console.log('auction', currentAuction)
        return(
            <>
            <div className='d-flex flex-column justify-content-start align-items-center' style={{width: '100%', height: '100%'}}>
                <div className='d-flex flex-row justify-content-center align-items-center' style={{width: '100%'}} onClick={() => setShowNFT(true)}>
                    <AuctionElement auction={currentAuction} subtitle={`${currentAuction.users} active users`} />
                    {getActionBtn()}
                </div>
                <div className='auction-details-messages'></div>
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

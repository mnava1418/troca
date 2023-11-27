import {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { connectionStatusSelector } from '../store/slices/statusSlice';
import { setAuctionListeners } from '../services/socketServices'
import { PATHS } from '../config';
import Auction from '../models/Auction';

import AuctionsList from './AuctionsList';
import AuctionDetails from './AuctionDetails';

import '../styles/Auction.css'

function Auctions() {
    const { isConnected, isMember, socket, account  } = useSelector(connectionStatusSelector)  
    const dispatch = useDispatch()
    const auctionModel = new Auction(dispatch)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        } else {
            auctionModel.getLiveAuctions()
            setAuctionListeners(socket, dispatch, {}, account)
        }
        // eslint-disable-next-line
    }, [isConnected, isMember])

    return(
        <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
            <div className='auction-container'>
                <AuctionsList />
                <AuctionDetails />
            </div>
        </section>
    )
}

export default Auctions
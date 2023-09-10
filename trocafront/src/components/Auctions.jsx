import {useEffect} from 'react'
import { useSelector } from 'react-redux'

import { connectionStatusSelector } from '../store/slices/statusSlice';
import { PATHS } from '../config';

import AuctionsList from './AuctionsList';
import AuctionDetails from './AuctionDetails';

import '../styles/Auction.css'

function Auctions() {
    const { isConnected, isMember } = useSelector(connectionStatusSelector)  

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
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
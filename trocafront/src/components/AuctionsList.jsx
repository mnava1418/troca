import { useSelector, useDispatch } from 'react-redux'
import { liveAuctionsSelector, selectAuction } from '../store/slices/auctionSlice'
import { connectionStatusSelector } from '../store/slices/statusSlice';
import { parseAccount } from '../services/ethServices';

import AuctionElement from './AuctionElement'

function AuctionsList() {
    const dispatch = useDispatch()
    const {liveAuctions, userAuction} = useSelector(liveAuctionsSelector)    
    const { socket } = useSelector(connectionStatusSelector)

    const openAuction = (id) => {
        dispatch(selectAuction(id))

        if(userAuction && userAuction.toString() === id.toString()) {
            socket.emit('join-auction-room', id)
        }        
    }

    const getAuctionsList = () => {
        const sortedAuctions = Object.values(liveAuctions)
        sortedAuctions.sort((a,b) => (parseInt(a.id) <= parseInt(b.id)) ? 1 : -1)

        return(
            <table style={{width: '100%'}}>
                <tbody>
                    {
                        sortedAuctions.map(auction => {
                            return(
                                <tr key={auction.id} onClick={() => {openAuction(auction.id)}}>
                                    <td key={auction.id}>
                                        <AuctionElement 
                                            auction={auction} 
                                            style={{borderBottom: '1px solid var(--contrast-color)'}} 
                                            subtitle={parseAccount(auction.account)}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }

    const getEmptyAuctions = () => {
        return(
            <div className='d-flex flex-column justify-content-center align-items-center' style={{width: '100%', height: '100%'}}>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>
            </div>
        )
    }

    return(
        <div className='d-flex flex-column justify-content-start align-items-center auction-list'>
            {Object.keys(liveAuctions).length > 0 ? getAuctionsList() : getEmptyAuctions()}
        </div>
    )
}

export default AuctionsList

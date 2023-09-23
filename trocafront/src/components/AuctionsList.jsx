import { useSelector, useDispatch } from 'react-redux'
import { liveAuctionsSelector, selectAuction } from '../store/slices/auctionSlice'
import { parseAccount } from '../services/ethServices';

import AuctionElement from './AuctionElement'

function AuctionsList() {
    const dispatch = useDispatch()
    const liveAuctions = useSelector(liveAuctionsSelector)    

    const getAuctionsList = () => {
        return(
            <table style={{width: '100%'}}>
                <tbody>
                    {
                        Object.keys(liveAuctions).map(auctionId => {
                            return(
                                <tr key={auctionId} onClick={() => {dispatch(selectAuction(auctionId))}}>
                                    <td key={auctionId}>
                                        <AuctionElement 
                                            auction={liveAuctions[auctionId]} 
                                            style={{borderBottom: '1px solid var(--contrast-color)'}} 
                                            subtitle={parseAccount(liveAuctions[auctionId].account)}
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

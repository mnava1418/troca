import { useSelector } from 'react-redux'
import { liveAuctionsSelector } from '../store/slices/auctionSlice'

import AuctionElement from './AuctionElement'

function AuctionsList() {
    const liveAuctions = useSelector(liveAuctionsSelector)    
    const getAuctionsList = () => {
        return(
            <table style={{width: '100%'}}>
                <tbody>
                    {
                        Object.keys(liveAuctions).map(auctionId => {
                            return(
                                <tr key={auctionId}>
                                    <td key={auctionId}>
                                        <AuctionElement auction={liveAuctions[auctionId]}/>
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

import { useState } from 'react'
import { useSelector } from 'react-redux'

import BidCatalog from './BidCatalog'

import { parseAccount } from "../services/ethServices"
import { allTokensSelector } from '../store/slices/portfolioSlice'

function BidItem({actor, tokenId, canUpdate}) {
    const [showCatalog, setShowCatalog] = useState(false)
    const allTokens = useSelector(allTokensSelector)

    const displayCatalog = (e) => {
        e.stopPropagation()

        if(canUpdate) {
            setShowCatalog(true)
        }
    }

    const getImgCard = () => {
        if(showCatalog) {
            return (
                <div className='d-flex flex-column justify-content-center align-items-center exchange-item'>
                    <BidCatalog owner={actor} setShowCatalog={setShowCatalog}/>
                </div>
            )
        } else {
            if(tokenId !== 0) {
                return(
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-item bg-img bg-im-cover' 
                        style={{backgroundImage: `url(${allTokens[tokenId].imageData})`}}
                        onClick={(e) => {displayCatalog(e)}} 
                    />
                ) 
            } else {
                return(
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-item' onClick={(e) => {displayCatalog(e)}}>
                        <div className='exchange-item-bg bg-img bg-im-contain' />
                    </div>
                )
            }
        }
    }

    return(
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <h4>{parseAccount(actor)}</h4>
            {getImgCard()}
        </div>
    )
}

export default BidItem
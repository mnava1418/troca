import { useState } from 'react'

import BidCatalog from './BidCatalog'

import { parseAccount } from "../services/ethServices"

function BidItem({actor, imgData, canUpdate}) {
    const [showCatalog, setShowCatalog] = useState(false)

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
            if(imgData !== undefined) {
                return(
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-item bg-img bg-im-cover' 
                        style={{backgroundImage: `url(${imgData})`}}
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
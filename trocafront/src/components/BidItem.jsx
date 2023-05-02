import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import BidCatalog from './BidCatalog'

import { parseAccount } from "../services/ethServices"
import { allTokensSelector, loadTokenImg } from '../store/slices/portfolioSlice'
import { INFURA_URL } from '../config'

function BidItem({actor, tokenId, canUpdate}) {
    const dispatch = useDispatch()
    const allTokens = useSelector(allTokensSelector)
    const [showCatalog, setShowCatalog] = useState(false)
    const [imageData, setImageData] = useState(undefined)
    
    const displayCatalog = (e) => {
        e.stopPropagation()

        if(canUpdate) {
            setShowCatalog(true)
        }
    }

    useEffect(() => {
        if(allTokens[tokenId]){
            if(!showCatalog && allTokens[tokenId].imageData === undefined) {                
                loadImage(allTokens[tokenId].image)
            } else {
                setImageData(allTokens[tokenId].imageData)
            }            
        }
        // eslint-disable-next-line
    }, [showCatalog])

    const loadImage = async(image) => {
        const imgFile = await fetch(`${INFURA_URL}/${image}`)
        const imgData = await imgFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            const data = reader.result
            dispatch(loadTokenImg({id: tokenId, data}))
            setImageData(data)
        }

        reader.readAsDataURL(imgData)
    }

    const getImgCard = () => {
        if(showCatalog) {
            return (
                <div className='d-flex flex-column justify-content-center align-items-center exchange-item'>
                    <BidCatalog owner={actor} setShowCatalog={setShowCatalog}/>
                </div>
            )
        } else {
            if(tokenId !== 0 && imageData) {
                return(
                    <div className='d-flex flex-column justify-content-center align-items-center exchange-item bg-img bg-im-cover' 
                        style={{backgroundImage: `url(${imageData})`}}
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
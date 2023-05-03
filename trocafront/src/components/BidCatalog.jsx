import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateOrderToken } from '../store/slices/exchangeSlice'
import { allTokensSelector, loadTokenImg } from '../store/slices/portfolioSlice'
import { INFURA_URL } from '../config'

function BidCatalog({owner, setShowCatalog}) {
    const dispatch = useDispatch()
    const allTokens = useSelector(allTokensSelector)
    const [catalog, setCatalog] = useState([])
    

    useEffect(() => {
        Object.values(allTokens).forEach(token => {
            if(token.owner === owner && token.isListed && token.imageData === undefined) {
                loadImage(token.image, token.id)
            }
        })
        
        setCatalog(Object.values(allTokens).filter(token => token.owner === owner && token.isListed))
        // eslint-disable-next-line
    }, [allTokens])

    const selectToken = async(e, id) => {
        e.stopPropagation()
        dispatch(updateOrderToken({id}))
        setShowCatalog(false)
    }

    const loadImage = async(image, id) => {
        const imgFile = await fetch(`${INFURA_URL}/${image}`)
        const imgData = await imgFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            const data = reader.result
            dispatch(loadTokenImg({id, data}))            
        }

        reader.readAsDataURL(imgData)
    }

    const generateCatalog = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center flex-wrap' style={{overflow: 'auto', width: '100%'}}>
                {catalog.map(token => {
                    return(
                        <div key={token.id} className='catalog-item bg-img bg-im-cover' style={{backgroundImage: `url("${token.imageData}")`}} onClick={(e) =>{selectToken(e, token.id)}}/>
                    )
                })}
            </div>
        )
    }

    return(
        <>
            {catalog.length > 0 ? generateCatalog() : <></>}
        </>
    )
}

export default BidCatalog
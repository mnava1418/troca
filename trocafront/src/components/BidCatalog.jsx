import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { catalogSelector, updateOrderToken } from '../store/slices/exchangeSlice'
import useWeb3 from '../hooks/useWeb3'
import Exchange from '../models/Exchange'

function BidCatalog({owner, setShowCatalog}) {
    const dispatch = useDispatch()
    const catalog = useSelector(catalogSelector)
    const { nft, troca } = useWeb3()

    const exchange = new Exchange(dispatch, troca, nft)

    useEffect(() => {
        if(catalog[owner] === undefined) {
            exchange.getTokensByAccount(owner)
        }
        
        // eslint-disable-next-line
    }, [])

    const selectToken = async(e, token) => {
        e.stopPropagation()

        const {id, image} = token
        const imageFile = await fetch(image)
        const imageData = await imageFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            const data = reader.result
            dispatch(updateOrderToken({id, data}))
            setShowCatalog(false)
        }

        reader.readAsDataURL(imageData)
    }

    const generateCatalog = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center flex-wrap' style={{overflow: 'auto', width: '100%', height: '100%'}}>
                {catalog[owner].map(token => {
                    return(
                        <div key={token.id} className='catalog-item bg-img bg-im-cover' style={{backgroundImage: `url("${token.image}")`}} onClick={(e) =>{selectToken(e, token)}}/>
                    )
                })}
            </div>
        )
    }

    return(
        <>
            {catalog[owner] !== undefined ? generateCatalog() : <></>}
        </>
    )
}

export default BidCatalog
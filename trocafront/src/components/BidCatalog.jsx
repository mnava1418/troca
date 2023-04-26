import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { catalogSelector } from '../store/slices/exchangeSlice'
import useWeb3 from '../hooks/useWeb3'
import Exchange from '../models/Exchange'

function BidCatalog({owner}) {
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

    const generateCatalog = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center flex-wrap' style={{overflow: 'auto', width: '100%', height: '100%'}}>
                {catalog[owner].map(token => {
                    return(
                        <div key={token.id} className='catalog-item bg-img bg-im-cover' style={{backgroundImage: `url("${token.image}")`}} />
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
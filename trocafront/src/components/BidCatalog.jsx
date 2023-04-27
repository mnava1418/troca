import { useSelector, useDispatch } from 'react-redux'

import { updateOrderToken } from '../store/slices/exchangeSlice'
import { allTokensSelector } from '../store/slices/portfolioSlice'

function BidCatalog({owner, setShowCatalog}) {
    const dispatch = useDispatch()
    const allTokens = useSelector(allTokensSelector)
    const catalog = Object.values(allTokens).filter(token => token.owner === owner)

    const selectToken = async(e, id) => {
        e.stopPropagation()
        dispatch(updateOrderToken({id}))
        setShowCatalog(false)
    }

    const generateCatalog = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center flex-wrap' style={{overflow: 'auto', width: '100%', height: '100%'}}>
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
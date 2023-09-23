import { INFURA_URL } from '../config'

function AuctionElement({auction, style, subtitle}) {
    const {image, tokenId, title} = auction

    return(
        <div className='d-flex flex-row justify-content-start align-items-center auction-element'>
            <div className='bg-img bg-im-cover auction-element-icon' style={{backgroundImage: `url(${INFURA_URL}/${image})`}} />
            <div className='d-flex flex-column justify-content-start align-items-start auction-element-info' style={style}>
                <h5 style={{color: 'white'}}>{`#${tokenId} ${title}`}</h5>        
                <h6>{subtitle}</h6>
            </div>                                            
        </div>
    )
}

export default AuctionElement
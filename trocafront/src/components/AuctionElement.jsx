import { INFURA_URL } from '../config'
import { parseAccount } from '../services/ethServices';

function AuctionElement({auction}) {
    const {image, tokenId, title, account} = auction

    return(
        <div className='d-flex flex-row justify-content-start align-items-center auction-element'>
            <div className='bg-img bg-im-cover auction-element-icon' style={{backgroundImage: `url(${INFURA_URL}/${image})`}} />
            <div className='d-flex flex-column justify-content-start align-items-start auction-element-info'>
                <h5 style={{color: 'white'}}>{`#${tokenId} ${title}`}</h5>        
                <h6>{parseAccount(account)}</h6>
            </div>                                            
        </div>
    )
}

export default AuctionElement
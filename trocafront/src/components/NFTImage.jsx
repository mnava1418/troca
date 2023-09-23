import { INFURA_URL } from '../config'

import '../styles/Mint.css'
import '../styles/Exchange.css'

function NFTImage({image, close}) {
    return(
        <section className='d-flex flex-column justify-content-center align-items-center nft-container' onClick={() => close(false)}>
            <div className='exchange-container'>
                <div className='bg-img bg-im-cover' style={{backgroundImage: `url(${INFURA_URL}/${image})`, width: '300px', height: '300px'}}/>
            </div>
        </section>
    )
}

export default NFTImage
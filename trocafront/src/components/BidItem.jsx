import { parseAccount } from "../services/ethServices"

function BidItem({actor, imgData}) {

    const getImgCard = () => {
        if(imgData !== undefined) {
            return(
                <div className='d-flex flex-column justify-content-center align-items-center exchange-item bg-img bg-im-cover' style={{backgroundImage: `url(${imgData})`}} />
            ) 
        } else {
            return(
                <div className='d-flex flex-column justify-content-center align-items-center exchange-item'>
                    <div className='exchange-item-bg bg-img bg-im-contain' />
                </div>
            )
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
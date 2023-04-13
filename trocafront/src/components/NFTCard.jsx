import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import NFTDetails from './NFTDetails';
import TrocaModal from './helpers/TrocaModal';

import { loadTokenImg } from '../store/slices/portfolioSlice';
import { connectionStatusSelector } from '../store/slices/statusSlice';
import { INFURA_URL } from '../config';
import usePortfolio from '../hooks/usePortfolio';
import useNFTActions from '../hooks/useNFTActions';
import useNFTCard from '../hooks/useNFTCard';
import useWeb3 from '../hooks/useWeb3';
import MyPortfolio from '../models/MyPortfolio';

import '../styles/NFTCard.css'

function NFTCard({owner, onlyUser, token, isProcessingLocal, setIsProcessingLocal}) {
    const {id, title, price, image, isListed} = token
    const dispatch = useDispatch()
    const myPortfolio = new MyPortfolio(dispatch)

    const { isMember, account, socket } = useSelector(connectionStatusSelector)
    const { allTokens } = usePortfolio()
    const { nft, troca } = useWeb3()
    const { showDetails, setShowDetails } = useNFTActions()

    const {
        showModal, setShowModal,
        tokenImg, setTokenImage
    } = useNFTCard()

    useEffect(() => {
        if(allTokens[id].imageData === undefined) {
            loadImage()
        } else {
            setTokenImage({backgroundImage: `url(${allTokens[id].imageData})`})
        }
        // eslint-disable-next-line
    }, [])

    const loadImage = async () => {
        const imageFile = await fetch(`${INFURA_URL}/${image}`)
        const imageData = await imageFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            const data = reader.result
            dispatch(loadTokenImg({id, data}))
            setTokenImage({backgroundImage: `url(${data})`})
        }

        reader.readAsDataURL(imageData)
    }
    
    const cardAction = (e, action) => {
        e.stopPropagation()

        switch (action) {
            case 'bid':
                alert('Vamo a ofertar')
                break;

            case 'buy':
                alert('Vamo a comprar')
                break;

            case 'mint':
                alert('Vamo a mintear')
                break;

            case 'update':
                setShowDetails(true)
                break;
    
            case 'list':
                setShowModal(true)
                break;

            default:
                alert('No estes chingando')
                break;
        }
    }

    const listNFT = () => {
        myPortfolio.list(account, nft, troca, id, socket)
    }

    const getOwnerActions = () => {
        return(
            <div className='d-flex flex-row justify-content-center align-items-center'>                
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {cardAction(e, 'update')}}>Update</Button>
                {!isListed ? <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={(e) => {cardAction(e, 'list')}}>List NFT</Button> : <></>}
            </div>
        )
    }

    const getUserActions = () => {
        return(
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('buy')}}>Buy</Button>
                {isMember ? <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('bid')}}>Place Bid</Button> : <></>}
            </div>
        )
    }

    return (
        <>
            <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-shadow' style={{ width: '20rem', margin: '40px' }} onClick={(e) => {cardAction(e, 'update')}}>
                <div className='nft-card-img bg-img bg-im-cover' style={tokenImg} />
                <Card.Body className='d-flex flex-column justify-content-end align-items-center' style={{width: '90%'}}>
                    <Card.Title>{title}</Card.Title>
                    <div className='d-flex flex-row justify-content-around' style={{width: '100%', marginTop: '24px'}}>
                        <div>
                            <h6>{owner}</h6>
                            <h6 style={{color: 'var(--secondary-color)'}}>Owner</h6>                        
                        </div>
                        <div>
                            <h6>{`${price} ETH`}</h6>
                            <h6 style={{color: 'var(--secondary-color)'}}>Price</h6>
                        </div>
                    </div>
                    <hr style={{width: '100%'}}></hr>
                    {onlyUser ? getOwnerActions() : getUserActions()}
                </Card.Body>
            </Card>
            {showDetails ? <NFTDetails setShowDetails={setShowDetails} token={token} tokenImg={tokenImg} onlyUser={onlyUser} owner={owner} isProcessingLocal={isProcessingLocal} setIsProcessingLocal={setIsProcessingLocal} /> : <></>}
            <TrocaModal 
                body={<span>After you list your NFT, users from the network will be able to interact with them.</span>}
                title={`List your NFT #${id}`}
                action={listNFT}
                dispatch={dispatch}
                setShowModal={setShowModal}
                showModal={showModal} />
        </>
    );
  }
  
  export default NFTCard;

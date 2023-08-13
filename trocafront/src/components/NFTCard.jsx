import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import NFTDetails from './NFTDetails';
import TrocaModal from './helpers/TrocaModal';

import { loadTokenImg } from '../store/slices/portfolioSlice';
import { connectionStatusSelector, chatUsersSelector } from '../store/slices/statusSlice';
import { INFURA_URL } from '../config';
import usePortfolio from '../hooks/usePortfolio';
import useNFTActions from '../hooks/useNFTActions';
import useNFTCard from '../hooks/useNFTCard';
import useWeb3 from '../hooks/useWeb3';
import MyPortfolio from '../models/MyPortfolio';
import Exchange from '../models/Exchange';

import '../styles/NFTCard.css'

function NFTCard({formatOwner, onlyUser, token, isProcessingLocal, setIsProcessingLocal}) {
    const {id, title, price, image, isListed, owner} = token
    const dispatch = useDispatch()    

    const { isMember, account, socket } = useSelector(connectionStatusSelector)
    const chatUsers = useSelector(chatUsersSelector)
    const { allTokens } = usePortfolio()
    const { nft, troca, web3 } = useWeb3()
    const { showDetails, setShowDetails } = useNFTActions()

    const {
        showModal, setShowModal,
        modal, setModal,
        tokenImg, setTokenImage
    } = useNFTCard()

    const myPortfolio = new MyPortfolio(dispatch)
    const exchange = new Exchange(dispatch, troca, nft)

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
                placeBid()
                break;

            case 'buy':
                myPortfolio.buyToken(troca, nft, web3, token, account)
                break;

            case 'update':
                setShowDetails(true)
                break;
    
            case 'list':
                listNFT()
                break;

            default:
                break;
        }
    }

    const listNFT = () => {
        setModal({
            body: 'After you list your NFT, users from the network will be able to interact with them. You cannot undo this action.',
            title: `List your NFT #${id}`,
            action: () => {myPortfolio.list(account, nft, troca, id, socket)}
        })
        setShowModal(true)
    }

    const placeBid = () => {
        if(chatUsers[owner]) {
            exchange.prepareNewBid(owner, id, account)
        } else {
            setModal({
                body: <>Seems <b>{formatOwner}</b> is offline and you might need to wait longer for a response. Do you want to continue?`</>,
                title: `Place a bid for token #${id}`,
                action: () => {exchange.prepareNewBid(owner, id, account)}
            })
            setShowModal(true)
        }
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
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={(e) => {cardAction(e, 'buy')}}>Buy</Button>
                {isMember ? <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={(e) => {cardAction(e,'bid')}}>Place Bid</Button> : <></>}
            </div>
        )
    }

    return (
        <>
            <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-portfolio nft-card-shadow' style={{ width: '20rem', margin: '40px' }} onClick={(e) => {cardAction(e, 'update')}}>
                <div className='nft-card-img bg-img bg-im-cover' style={tokenImg} />
                <Card.Body className='d-flex flex-column justify-content-end align-items-center' style={{width: '90%'}}>
                    <Card.Title>{`#${id} ${title}`}</Card.Title>
                    <div className='d-flex flex-row justify-content-around' style={{width: '100%', marginTop: '24px'}}>
                        <div>
                            <h6>{formatOwner}</h6>
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
            {showDetails ? <NFTDetails setShowDetails={setShowDetails} token={token} tokenImg={tokenImg} onlyUser={onlyUser} formatOwner={formatOwner} isProcessingLocal={isProcessingLocal} setIsProcessingLocal={setIsProcessingLocal} /> : <></>}
            <TrocaModal 
                body={<span>{modal.body}</span>}
                title={modal.title}
                action={modal.action}
                dispatch={dispatch}
                setShowModal={setShowModal}
                showModal={showModal} />
        </>
    );
  }
  
  export default NFTCard;

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';

import { connectionStatusSelector } from '../store/slices/statusSlice';
import useMint from '../hooks/useMint';
import useWeb3 from '../hooks/useWeb3';
import useCreate from '../hooks/useCreate';
import { PATHS } from '../config';
import {setMintingListeners} from '../services/socketServices'

import '../styles/NFTCard.css'

function Mint() {    

    const dispatch = useDispatch()
    const { isConnected, isMember, socket, account } = useSelector(connectionStatusSelector)  
    const { nft, troca } = useWeb3()
    const [validated, setValidated] = useState(false)
    
    const {actions, animation, labels, mintingStatus} = useMint()
    const {isMinting, showNFT, balanceOf, mintLimit} = mintingStatus
    const {animateCard, animateLogo, tokenImg} = animation
    const {header, subtitle} = labels

    const {
        title, setTitle,
        description, setDescription,
        price, setPrice,        
    } = useCreate('', '', '', '', undefined)

    const mintNFT = (e) => {        
        e.stopPropagation()
        const form = document.getElementById('mintForm')
        
        if (form.checkValidity() && balanceOf < mintLimit) {
            actions.startMinting()
            socket.emit('generate-token', {title, description, price})
        } else {
            setValidated(true);
        }        
    }

    const getActionBtn = () => {
        if (balanceOf < mintLimit) {
            return (
                <Form.Group controlId="mintBtn">
                    <Button variant="primary" style={{fontWeight: '600', width: '100%'}} onClick={mintNFT} >Mint NFT</Button>
                </Form.Group>
            )
        } else {
            return <></>
        }
    }

    const goToPortfolio = (e) => {        
        e.stopPropagation()
        window.location.href = PATHS.portfolio
    }

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        } else {
            setMintingListeners(dispatch, account, socket, actions, {troca, nft})
        }

        // eslint-disable-next-line
    }, [isConnected, isMember])

    return(
        <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
            <h1>{header}</h1>            
            <h4>{subtitle}</h4>
            <br />
            <div className='d-flex mint-container align-items-center'>
                <div className={`nft-mint-container ${showNFT}`}>
                    <Card className={`d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-portfolio nft-card-shadow nft-card-back ${animateCard}`} style={{ width: '20rem', height: '20rem' }}>
                        <div className={`nft-card-back-img bg-img bg-im-contain ${animateLogo}`} />
                    </Card>    
                    <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-portfolio nft-card-front' style={{ width: '20rem', height: '20rem', overflow: 'hidden' }} onClick={goToPortfolio}>
                        <div className='bg-img bg-im-cover' style={{width: '100%', height: '100%', backgroundImage: `url(${tokenImg})` }}/>
                    </Card>
                </div>   
                <div className='mint-form form-container form-container-dark'>                    
                    <Form id='mintForm' noValidate validated={validated} autoComplete='off'>
                        <Form.Group controlId="mintTitle">
                            <Form.Label style={{fontWeight: '600'}}>Title</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="NFT Title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Title is mandatory.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="mintDescription">
                            <Form.Label style={{fontWeight: '600'}}>Description</Form.Label>
                            <Form.Control 
                                required
                                as='textarea'
                                placeholder='Description will be used to generate the image. Be as descriptive as possible.'
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Description is mandatory.</Form.Control.Feedback>
                        </Form.Group>
                        <div className='d-flex form-container-row justify-content-center align-items-start'>
                            <Form.Group controlId="mintPrice" style={{marginLeft: '0px', marginRight: '0px'}}>
                                <Form.Label style={{fontWeight: '600'}}>Price</Form.Label>
                                <Form.Control
                                    required
                                    type='number'
                                    step='0.00001'
                                    min='0'
                                    placeholder="10 ETH"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid price.</Form.Control.Feedback>
                            </Form.Group>                                
                        </div>
                        {isMinting ? <div className='d-flex flex-column justify-content-center align-items-center' style={{margin: '0px'}}><Spinner animation='grow' variant='secondary' style={{margin: '0px'}}/> </div>: getActionBtn()}
                    </Form>
                </div>
            </div>
            <br />
            <h4>{balanceOf < mintLimit ? `NFTs remaining to mint: ${mintLimit - balanceOf}/${mintLimit}` : 'Sorry, no more nfts to mint.'}</h4>
        </section>       
    )
}

export default Mint

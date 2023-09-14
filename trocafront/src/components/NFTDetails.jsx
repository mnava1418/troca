import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion'

import useWeb3 from '../hooks/useWeb3';
import { parseAccount } from '../services/ethServices';
import { connectionStatusSelector } from '../store/slices/statusSlice';
import { setAuctionListeners } from '../services/socketServices'

import '../styles/Mint.css'

function NFTDetails({setShowDetails, token, tokenImg, onlyUser, formatOwner, isProcessingLocal, setIsProcessingLocal}) {
    const [validated, setValidated] = useState(false)
    const {id, title, description, price, key, isListed} = token
    const [priceETH, setPriceETH] = useState(price)
        
    const {nft} = useWeb3()
    const { socket, isMember } = useSelector(connectionStatusSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        if(onlyUser) {
            setAuctionListeners(socket, dispatch, {setIsProcessingLocal})
        } 

        // eslint-disable-next-line
    }, [])

    const handleSubmit = () => {
        const form = document.getElementById('detailsForm')
        if (form.checkValidity()) {
            setIsProcessingLocal(true)
            socket.emit('update-token-price', key, id, token.owner, priceETH)
        } else {
            setValidated(true);
        }
    }

    const createAuction = () => {
        setIsProcessingLocal(true)
        socket.emit('create-auction', token)
    }
    
    const getActionBtn = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center'>                
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={() => {setShowDetails(false)}}>Close</Button>
                {onlyUser ? <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={handleSubmit}>Update</Button> : ''}
                {onlyUser && isListed  && isMember? <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={createAuction}>Auction</Button> : ''}
            </div> 
        )
    }

    return(
        <div id='nftContainer' className='d-flex flex-column justify-content-center align-items-center nft-container'>
            <div id='nftDetails' className='d-flex mint-container align-items-center'>                
                <div id='mintImageDiv' className='mint-img mint-img-full bg-img bg-im-cover' style={tokenImg} />                                                
                <div className='mint-form form-container form-container-dark'>
                    <Form id='detailsForm' noValidate validated={validated} autoComplete='off'>
                        <Form.Group controlId="mintTitle">
                            <h1>{`${title} #${id}`}</h1>
                            <h4>{formatOwner}</h4>
                        </Form.Group>
                        <Form.Group controlId="mintDescription">
                            <Form.Label style={{fontWeight: '600'}}>Description</Form.Label>
                            <Form.Control as='textarea' disabled={true} defaultValue={description} style={{backgroundColor: 'transparent'}}/>
                        </Form.Group>
                        <div className='d-flex form-container-row justify-content-center align-items-start'>
                            <Form.Group controlId="mintPrice" style={{marginLeft: '0px'}}>
                                <Form.Label style={{fontWeight: '600'}}>Price ETH</Form.Label>
                                <Form.Control
                                    required
                                    type='number'
                                    step='0.00001'
                                    min='0'
                                    placeholder="10 ETH"
                                    defaultValue={priceETH}
                                    disabled={!onlyUser}
                                    onChange={(e) => setPriceETH(e.target.value)}
                                    style={{backgroundColor: 'transparent'}}
                                />
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid price.</Form.Control.Feedback>
                            </Form.Group>                            
                        </div>          
                        <Accordion className='nft-details'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><i className='bi bi-journals' />&nbsp;Details</Accordion.Header>
                                <Accordion.Body>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <div className='d-flex flex-row justify-content-between align-items-center nft-details-item'>
                                            <div>Contract Address</div>
                                            <div><a href={`https://etherscan.io/address/${nft._address}`} target={'_blank'} rel='noreferrer'>{parseAccount(nft._address)}</a></div>
                                        </div>    
                                        <div className='d-flex flex-row justify-content-between align-items-center nft-details-item'>
                                            <div>Token ID</div>
                                            <div>{id}</div>
                                        </div>    
                                        <div className='d-flex flex-row justify-content-between align-items-center nft-details-item'>
                                            <div>Token Standard</div>
                                            <div>ERC-721</div>
                                        </div>    
                                    </div>                                
                                </Accordion.Body>
                            </Accordion.Item>                            
                        </Accordion>                
                        {isProcessingLocal ? <div className='d-flex flex-column justify-content-center align-items-center' style={{margin: '0px'}}><Spinner animation='grow' variant='secondary' style={{margin: '0px'}}/> </div>: getActionBtn()}                     
                    </Form>                                                     
                </div>
            </div>
        </div>
    )
}

export default NFTDetails

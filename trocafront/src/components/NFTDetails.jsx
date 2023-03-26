import {useState} from 'react'
import {useSelector} from 'react-redux'
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion'

import useWeb3 from '../hooks/useWeb3';
import { isProcessingSelector } from '../store/slices/statusSlice';
import { parseAccount } from '../services/ethServices';

import '../styles/Mint.css'

function NFTDetails({setShowDetails, token, tokenImg, onlyUser, owner}) {
    const [validated, setValidated] = useState(false)
    const {id, title, description, price, royalties} = token
    const [priceETH, setPrice] = useState(price)
        
    const isProcessing = useSelector(isProcessingSelector)
    const {nft} = useWeb3()
    
    const handleSubmit = () => {
        console.log('vamos a actualizar')
    }
    
    const getActionBtn = () => {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center'>                
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={() => {setShowDetails(false)}}>Close</Button>
                {onlyUser ? <Button variant="primary" style={{width: '100px', margin: '16px'}} >Update</Button> : ''}
            </div> 
        )
    }

    return(
        <div id='nftContainer' className='d-flex flex-column justify-content-center align-items-center nft-container'>
            <div id='nftDetails' className='d-flex mint-container align-items-center'>                
                <div id='mintImageDiv' className='mint-img mint-img-full bg-img bg-im-cover' style={tokenImg} />                                                
                <div className='mint-form form-container form-container-dark'>
                    <Form id='mintForm' noValidate validated={validated} autoComplete='off'>
                        <Form.Group controlId="mintTitle">
                            <h1>{`${title} #${id}`}</h1>
                            <h4>{owner}</h4>
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
                                    onChange={(e) => setPrice(e.target.value)}
                                    style={{backgroundColor: 'transparent'}}
                                />
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid price.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="mintRoyalties" style={{marginRight: '0px'}}>
                                <Form.Label style={{fontWeight: '600'}}>Royalties</Form.Label>
                                <Form.Control type='number' disabled={true} defaultValue={royalties} style={{backgroundColor: 'transparent'}} />
                            </Form.Group>
                        </div>          
                        <Accordion className='nft-details'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><i className='bi bi-journals' />&nbsp;Details</Accordion.Header>
                                <Accordion.Body>
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <div className='d-flex flex-row justify-content-between align-items-center nft-details-item'>
                                            <div>Contract Address</div>
                                            <div><a href={`https://etherscan.io/address/${nft._address}`} target={'_blank'}>{parseAccount(nft._address)}</a></div>
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
                        {isProcessing ? <div className='d-flex flex-column justify-content-center align-items-center' style={{margin: '0px'}}><Spinner animation='grow' variant='secondary' style={{margin: '0px'}}/> </div>: getActionBtn()}                     
                    </Form>                                                     
                </div>
            </div>
        </div>
    )
}

export default NFTDetails

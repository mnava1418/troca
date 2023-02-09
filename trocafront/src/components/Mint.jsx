import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Exchange from '../models/Exchange';
import useWeb3 from '../hooks/useWeb3';

import { 
    connectionStatusSelector, 
    isProcessingSelector, 
    setIsProcessing,
    closeAlert
} from '../store/slices/statusSlice';

import { PATHS } from '../config';

import '../styles/Mint.css'

function Mint() {    
    const [validated, setValidated] = useState(false)
    const [imgFile, setImgFile] = useState(undefined)
    const { isConnected, isMember } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)

    const { troca, nft } = useWeb3()
    const dispatch = useDispatch()

    useEffect(() => {        
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        }

        // eslint-disable-next-line       
    }, [isConnected, isMember])

    const handleSubmit = async () => {
        const form = document.getElementById('mintForm')
        if (form.checkValidity()) {
            dispatch(setIsProcessing(true))
            dispatch(closeAlert())

            const title = document.getElementById('mintTitle').value
            const description = document.getElementById('mintDescription').value
            const exchange = new Exchange(dispatch, troca, nft)
            exchange.mint(title, description, imgFile)
        } else {
            setValidated(true);
        }
    };

    const loadImage = () => {
        const file = document.getElementById('mintImageFile').files[0]
        
        if(file.size * 0.000001 > 100) {
            document.getElementById('mintImageFile').value = ''
            setValidated(true);
        } else {
            const reader = new FileReader()

            reader.onloadend = () => {
                document.getElementById('mintImageDiv').style.backgroundImage = `url(${reader.result})`
                document.getElementById('mintImageDiv').style.borderStyle = 'solid'
                document.getElementById('mintImageDiv').innerHTML = ''            
                setImgFile(file)
            }

            if(file) {
                reader.readAsDataURL(file)
            } 
        }
    }

    const getActionBtn = () => {
        return (
            <Form.Group controlId="mintBtn">
                <Button variant="primary" style={{fontWeight: '600', width: '100%'}} onClick={handleSubmit} >Create item</Button>
            </Form.Group>
        )
    }
    
    const showPage = () => {
        return (
            <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
                <div className='d-flex mint-container justify-content-center align-items-center'>
                    <div id='mintImageDiv' className='mint-img bg-img bg-im-cover' onClick={() => {document.getElementById('mintImageFile').click()}}>
                        <div className='d-flex flex-column justify-content-center align-items-center full-content'>
                            <i className='bi bi-image' style={{fontSize: '60px', color: 'var(--secondary-color)'}}/>
                            <h3>Select a file</h3>
                            <h5>PNG, JPG, or GIF. Max 100mb.</h5>
                        </div>
                    </div>
                    <div className='mint-form form-container form-container-dark'>
                        <Form id='mintForm' noValidate validated={validated} autoComplete='off'>
                            <Form.Group controlId="mintImageFile">
                                <Form.Control required hidden type="file" accept="image/*" onChange={() => {loadImage()}}/>
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Image is mandatory and max size is 100mb.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="mintTitle">
                                <Form.Label style={{fontWeight: '600'}}>Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter item title"
                                />
                                <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Title is mandatory.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="mintDescription">
                                <Form.Label style={{fontWeight: '600'}}>Description (optional)</Form.Label>
                                <Form.Control 
                                    as='textarea'
                                    placeholder='Type item description'
                                />
                            </Form.Group>
                            <div className='d-flex form-container-row justify-content-center align-items-start'>
                                <Form.Group controlId="mintPrice" style={{marginLeft: '0px'}}>
                                    <Form.Label style={{fontWeight: '600'}}>Price</Form.Label>
                                    <Form.Control
                                        required
                                        type='number'
                                        min='0'
                                        placeholder="10 ETH"
                                    />
                                    <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid price.</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="mintRoyalties" style={{marginRight: '0px'}}>
                                    <Form.Label style={{fontWeight: '600'}}>Royalties</Form.Label>
                                    <Form.Control
                                        required
                                        type='number'
                                        min='0'
                                        max='100'
                                        placeholder="5%"
                                    />
                                    <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Invalid royalties.</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            {isProcessing ? <div className='d-flex flex-column justify-content-center align-items-center' style={{margin: '0px'}}><Spinner animation='grow' variant='secondary' style={{margin: '0px'}}/> </div>: getActionBtn()}
                        </Form>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {isConnected && isMember ? showPage() : <Spinner animation='grow' variant='secondary'/>}
        </>
      );
  }
  
  export default Mint;
  
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { connectionStatusSelector } from '../store/slices/statusSlice';
import { PATHS } from '../config';

import '../styles/Mint.css'

function Mint() {    
    const [validated, setValidated] = useState(false)
    const { isConnected, isMember } = useSelector(connectionStatusSelector)

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
            alert('vamos a mintear!')
        } else {
            setValidated(true);
        }
    };
    
    const showPage = () => {
        return (
            <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
                <div className='d-flex mint-container justify-content-center align-items-center'>
                    <div className='mint-img'>
                        <div className='d-flex flex-column justify-content-center align-items-center full-content'>
                            <i className='bi bi-image' style={{fontSize: '60px', color: 'var(--secondary-color)'}}/>
                            <h3>Select a file</h3>
                            <h5>PNG, JPG, or GIF. Max 200mb.</h5>
                        </div>
                    </div>
                    <div className='mint-form form-container form-container-dark'>
                        <Form id='mintForm' noValidate validated={validated} autoComplete='off'>
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
                            <Form.Group controlId="mintBtn">
                                <Button variant="primary" style={{fontWeight: '600', width: '100%'}} onClick={handleSubmit} >Create item</Button>
                            </Form.Group>                                                   
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
  
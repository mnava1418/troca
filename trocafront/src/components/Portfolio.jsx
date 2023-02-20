import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'

import { connectionStatusSelector, isProcessingSelector } from '../store/slices/statusSlice';

import { PATHS } from '../config';
import MyPortfolio from '../models/MyPortfolio';

function Portfolio () {
    const { isConnected } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)
    const [ currentTokens, setCurrentTokens] = useState({})

    const dispatch = useDispatch()
    const myPortfolio = new MyPortfolio(dispatch)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else {            
            myPortfolio.getTokens()
        } 
        
        // eslint-disable-next-line
    }, [isConnected])

    const generateCatalog = () => {
        return(
            <div style={{width: '90%', backgroundColor: 'red'}}>Contenido</div>
        )
    }

    const emptyCatalog = () => {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center' style={{width: '90%'}}>
                <h4 style={{margin: '100px 0px 24px 0px'}}>We weren't able to find NFTs.</h4>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>        
            </div>
        )
    }

    const showPage = () => {
        return(
            <section className='full-screen d-flex flex-column justify-content-start align-items-center'>
                <div className='dark-container form-container form-container-dark' style={{width: '90%', margin: '24px 0px 24px 0px'}}>
                    <Form>
                        <div className='d-flex justify-content-end align-items-center search-bar'>
                            <div className='search-bar-check input-group'>
                                <div className='form-check d-flex flex-row justify-content-center align-items-center'>
                                    <label className='switch' style={{marginRight: '12px'}}>
                                        <input type="checkbox" className='form-check-input' />
                                        <span className='slider round'></span>
                                    </label>
                                    <label className="form-check-label">My NFTs</label>
                                </div>
                            </div>
                            <InputGroup style={{marginRight: '0px'}}>
                                <Form.Select>
                                    <option>Sort by</option>
                                    <option>Top Price</option>
                                    <option>Low Price</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                </Form.Select>
                            </InputGroup>
                            <InputGroup className='search-bar-input'>
                                <Form.Control type="text" placeholder="address, author or title." />
                                <InputGroup.Text><i className='bi bi-search' /></InputGroup.Text>
                            </InputGroup>
                        </div>
                    </Form>
                </div>
                {Object.keys(currentTokens).length > 0 ? generateCatalog() : emptyCatalog()}
            </section>
        )
    }

    return (
        <>
            {isConnected && !isProcessing ? showPage() : <Spinner animation='grow' variant='secondary'/>}
        </>
    );
}

export default Portfolio

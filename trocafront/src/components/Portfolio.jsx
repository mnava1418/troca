import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import NFTCard from './NFTCard';

import { connectionStatusSelector, isProcessingSelector } from '../store/slices/statusSlice';
import { setOnlyUser } from '../store/slices/portfolioSlice';

import usePortfolio from '../hooks/usePortfolio';
import MyPortfolio from '../models/MyPortfolio';
import User from '../models/User';
import { PATHS } from '../config';
import { parseAccount, parseUsername } from '../services/ethServices';

function Portfolio () {
    const { isConnected } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)
    
    const { onlyUser, selectedTokens, allUsers } = usePortfolio()
    
    const dispatch = useDispatch()
    const myPortfolio = new MyPortfolio(dispatch)
    const user = new User(dispatch)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else {      
            myPortfolio.getTokens()
            user.getAllUsers()
        } 
        
        // eslint-disable-next-line
    }, [isConnected])

    const generateCatalog = () => {     
        return(
            <div className='d-flex flex-row justify-content-center flex-wrap fixed-container' style={{width: '90%'}}>
                {selectedTokens.map(token => {           
                    let owner = token.owner

                    if(allUsers[owner] !== undefined && allUsers[owner].username.trim() !== '') {
                        owner = parseUsername(`@${allUsers[owner].username.trim()}`)
                    } else {
                        owner = parseAccount(owner)
                    }
                    
                    return(
                        <NFTCard key={token.uri} 
                            img={token.imgPath} 
                            title={token.title}
                            owner={owner}
                            price={token.price}
                            onlyUser={onlyUser}
                        />
                    )
                })}
            </div>
        )        
    }

    const emptyCatalog = () => {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center fixed-container' style={{width: '90%'}}>
                <h4 style={{margin: '100px 0px 24px 0px'}}>We weren't able to find NFTs.</h4>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>        
            </div>
        )
    }

    const showPage = () => {
        return(
            <section className='full-screen d-flex flex-column justify-content-start align-items-center'>
                <div style={{backgroundColor: 'var(--bg-color)', width: '100%', height: '24px', position: 'fixed', zIndex: '10'}} />
                <div className='dark-container form-container form-container-dark search-bar-fixed'>
                    <Form>
                        <div className='d-flex justify-content-end align-items-center search-bar'>
                            <div className='search-bar-check input-group'>
                                <div className='form-check d-flex flex-row justify-content-center align-items-center'>
                                    <label className='switch' style={{marginRight: '12px'}}>
                                        <input type="checkbox" className='form-check-input' defaultChecked={onlyUser} onChange={(e) => {dispatch(setOnlyUser(e.target.checked))}} />
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
                {selectedTokens.length > 0 ? generateCatalog() : emptyCatalog()}
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

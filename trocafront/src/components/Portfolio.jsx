import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import NFTCard from './NFTCard';

import { connectionStatusSelector, isProcessingSelector } from '../store/slices/statusSlice';
import { setOnlyUser, setSelectedTokens } from '../store/slices/portfolioSlice';

import usePortfolio from '../hooks/usePortfolio';
import useWeb3 from '../hooks/useWeb3';
import MyPortfolio from '../models/MyPortfolio';
import User from '../models/User';
import { PATHS } from '../config';
import { parseAccount, parseUsername } from '../services/ethServices';

function Portfolio () {
    const { isConnected } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)
    const { nft } = useWeb3()

    const [showFilters, setShowFilters ] = useState(false)

    const { 
        onlyUser, 
        selectedTokens, 
        allUsers,
        allTokens
    } = usePortfolio()
    
    const dispatch = useDispatch()
    const myPortfolio = new MyPortfolio(dispatch)
    const user = new User(dispatch)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else {      
            myPortfolio.getTokens(nft)
            user.getAllUsers()
        } 
        
        // eslint-disable-next-line
    }, [isConnected])

    const onKeyDown = (e) => {
        if(e.keyCode === 13) {
            e.preventDefault()
        }
    }

    const search = (text) => {
        
        let currentTokens = [...Object.values(allTokens)].filter(
            element => {
                let userName = ''

                if(allUsers[element.owner] !== undefined ) {
                    userName = allUsers[element.owner].username
                }

                return element.title.toUpperCase().includes(text) || 
                    element.owner.toUpperCase().includes(text) ||
                    userName.toUpperCase().includes(text)
            }
        )
        
        dispatch(setSelectedTokens(currentTokens))
    }

    const sortTokens = (sortBy) => {
        const currentTokens = [...selectedTokens]

        switch (sortBy) {
            case 'topPrice':
                currentTokens.sort((a, b) => (parseFloat(a.price) <= parseFloat(b.price)) ? 1 : -1 )
                break;
            case 'lowPrice':
                currentTokens.sort((a, b) => (parseFloat(a.price) >= parseFloat(b.price)) ? 1 : -1 )
                break;                      
            case 'newest':
                currentTokens.sort((a, b) => (parseInt(a.id) <= parseInt(b.id)) ? 1 : -1 )
                break;      
            case 'oldest':
                currentTokens.sort((a, b) => (parseInt(a.id) >= parseInt(b.id)) ? 1 : -1 )
                break;      
            default:                
                break;
        }

        dispatch(setSelectedTokens(currentTokens))
        setShowFilters(false)
    }

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
                        <NFTCard key={token.id}
                            onlyUser={onlyUser}
                            owner={owner}
                            token={token}
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

    const getFilterInputs = () => {
        return(
            <>
                {showFilters ? <Form.Label style={{fontWeight: '600'}}>Sort</Form.Label> : <></>}
                <InputGroup className={!showFilters ? 'search-bar-input' : ''} style={{marginRight: '0px'}}>
                    <Form.Select id='portfolioSort' onChange={(e) => {sortTokens(e.target.value)}}>
                        <option value=''>Sort by</option>
                        <option value='topPrice'>Top Price</option>
                        <option value='lowPrice'>Low Price</option>
                        <option value='newest'>Newest</option>
                        <option value='oldest'>Oldest</option>
                    </Form.Select>
                </InputGroup>
                {showFilters ? <><br/><Form.Label style={{fontWeight: '600'}}>Search</Form.Label></> : <></>}
                <InputGroup className={!showFilters ? 'search-bar-input' : ''}>
                    <Form.Control type="text" id='searchInput' placeholder="address, username or title." onKeyDown={onKeyDown} onKeyUp={(e) => {search(e.target.value.toUpperCase())}} />
                    <InputGroup.Text><i className='bi bi-search' /></InputGroup.Text>
                </InputGroup>
                {showFilters ? <><br/><Button variant="primary" onClick={() => {setShowFilters(false)}}>Search</Button></> : <></>}
            </>
        )
    }

    const showPage = () => {
        return(
            <section className='full-screen d-flex flex-column justify-content-start align-items-center'>
                <div className='d-flex flex-column justify-content-center align-items-center search-bar-fixed'>
                    <div className='dark-container form-container form-container-dark' style={{width: '90%'}}>
                        <Form autoComplete='off'>
                            <div className='d-flex align-items-center search-bar'>
                                <div className='d-flex flex-row align-items-center search-bar-check'>
                                    <div className='d-flex flex-row justify-content-center align-items-center'>
                                        <label className='switch' style={{marginRight: '12px'}}>
                                            <input type="checkbox" className='form-check-input' defaultChecked={onlyUser} 
                                                onChange={(e) => {
                                                    dispatch(setOnlyUser(e.target.checked))
                                                    search('')
                                                }} 
                                            />
                                            <span className='slider round'></span>
                                        </label>
                                        <label className="form-check-label">My NFTs</label>
                                    </div>
                                    <div className='search-bar-btn'>
                                        <Button variant="secondary" onClick={() => {setShowFilters(true)}}><i className='bi bi-filter'/></Button>
                                    </div>
                                </div>
                                {getFilterInputs()}
                            </div>
                        </Form>
                    </div>
                </div>
                {selectedTokens.length > 0 ? generateCatalog() : emptyCatalog()}
                <Offcanvas show={showFilters} onHide={() => {setShowFilters(false)}}>
                    <Offcanvas.Header closeButton style={{backgroundColor: 'var(--contrast-color)', color:'white'}}>
                        <h5>Portfolio Filters</h5>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='d-flex flex-column justify-content-start align-items-center' style={{backgroundColor: 'var(--contrast-color)', color: 'white'}}>
                        <div className='dark-container form-container form-container-dark' style={{width: '90%'}}>
                            <Form autoComplete='off'>
                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                    {getFilterInputs()}
                                </div>
                            </Form>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
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

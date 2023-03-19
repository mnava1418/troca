import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
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

    const search = () => {
        const text = document.getElementById('searchInput').value.toUpperCase()
        
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

    const sortTokens = () => {
        const sortBy = document.getElementById('portfolioSort').value
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
                                        <input type="checkbox" className='form-check-input' defaultChecked={onlyUser} 
                                            onChange={(e) => {
                                                dispatch(setOnlyUser(e.target.checked))
                                                document.getElementById('searchInput').value = ''
                                                document.getElementById('portfolioSort').value = ''
                                                search()
                                            }} 
                                        />
                                        <span className='slider round'></span>
                                    </label>
                                    <label className="form-check-label">My NFTs</label>
                                </div>
                            </div>
                            <InputGroup style={{marginRight: '0px'}}>
                                <Form.Select id='portfolioSort' onChange={sortTokens}>
                                    <option value=''>Sort by</option>
                                    <option value='topPrice'>Top Price</option>
                                    <option value='lowPrice'>Low Price</option>
                                    <option value='newest'>Newest</option>
                                    <option value='oldest'>Oldest</option>
                                </Form.Select>
                            </InputGroup>
                            <InputGroup className='search-bar-input'>
                                <Form.Control type="text" id='searchInput' placeholder="address, username or title." onKeyDown={onKeyDown} onKeyUp={search} />
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

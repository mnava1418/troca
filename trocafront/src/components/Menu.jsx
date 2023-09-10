import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Tooltip from 'react-bootstrap/Tooltip'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react'

import usePortfolio from '../hooks/usePortfolio';
import { connectionStatusSelector, showNftFilterSelector } from '../store/slices/statusSlice'
import { setOnlyUser, setSelectedTokens } from '../store/slices/portfolioSlice';
import { orderBookSelector } from '../store/slices/exchangeSlice'
import { parseAccount } from '../services/ethServices';
import { PATHS } from '../config'
import User from '../models/User';
import logo from '../img/logoTransparent.png'

function Menu() {
    const { isConnected, isOnline, account, isMember, isOwner, socket } = useSelector(connectionStatusSelector)
    const orderBook = useSelector(orderBookSelector)
    const dispatch = useDispatch()
    const user = new User(dispatch)

    const { onlyUser, selectedTokens, allUsers, allTokens } = usePortfolio()
    const showNftFilter = useSelector(showNftFilterSelector)
    const [showFilters, setShowFilters ] = useState(false)

    const [pendingNotifications, setPendingNotifications] = useState([])

    useEffect(() => {
        if(isConnected) {
            setPendingNotifications(Object.values(orderBook).filter(order => (order.buyer === account && order.buyerIsNew) || (order.seller === account && order.sellerIsNew)))
        }

        // eslint-disable-next-line
    }, [orderBook])
    
    const handleConnectWallet = () => {
        window.location.href = PATHS.wallet
    }

    const getWalletAction = () => {
        return(
            <Form className="d-flex">
                <Button variant="primary" style={{fontWeight: '600'}} onClick={handleConnectWallet}><i className="bi bi-wallet-fill" style={{marginRight: '8px'}}/>Wallet</Button>
            </Form>
        )
    }

    const getNftFilter = () => {        
        if(showNftFilter) {
            return(
                <div className='d-flex flex-row justify-content-start align-items-center'>
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
                    <Button variant="outline-light" onClick={() => setShowFilters(true)} style={{marginLeft: '16px'}}><i className="bi bi-funnel-fill"/></Button>
                </div>      
            )

        } else {
            return(<></>)
        }
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

    const getUserActions = () => {
        return(
            <Nav>
                <OverlayTrigger
                    key={`overlay-online`}
                    placement={`bottom`}
                    overlay={
                        <Tooltip id={`tooltip-online`}>
                            { isOnline ? 'Click to go offline' : 'Click to go online' }
                        </Tooltip>
                    }
                >
                    <Nav.Link href="#" onClick={() => {user.connectToChat(!isOnline, socket, account)}}><Spinner animation='grow' variant={ isOnline ? 'success' : 'danger'} size='sm'/></Nav.Link>
                </OverlayTrigger>  
                <OverlayTrigger
                    key={`overlay-account`}
                    placement={`bottom`}
                    overlay={
                        <Tooltip id={`tooltip-account`}>
                            {account}
                        </Tooltip>
                    }
                >
                    <Nav.Link href={PATHS.profile} style={{marginRight: '12px'}}>{
                        isMember ? 
                            <>{parseAccount(account)} <i className='bi bi-patch-check-fill' style={ isOwner ? {color: 'gold'} : {color: '#2ee09a'}} /></>
                        :
                            parseAccount(account) 
                        }
                    </Nav.Link>
                </OverlayTrigger>
                <Nav.Link href={PATHS.orderBook} style={{marginRight: '24px'}}>
                    <div style={{position: 'relative'}}>
                        <i className='bi bi-bell-fill' />                                          
                       {pendingNotifications.length > 0 ? <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">{pendingNotifications.length}</span> : <></>}
                    </div>
                </Nav.Link>
                {getNftFilter()}
            </Nav>
        )
    }

    const getMenuActions = () => {
        if(isConnected) {
            return getUserActions()
        } else {
            return getWalletAction()
        }
    }

    const onKeyDown = (e) => {
        if(e.keyCode === 13) {
            e.preventDefault()
        }
    }

    const generateSideMenu = () => {
        return(
            <Offcanvas show={showFilters} onHide={() => {setShowFilters(false)}} placement='end'>
                <Offcanvas.Header closeButton style={{color:'white'}}>
                    <h5>Portfolio Filters</h5>
                </Offcanvas.Header>
                <Offcanvas.Body className='d-flex flex-column justify-content-start align-items-center' style={{color: 'white'}}>
                    <div className='dark-container form-container form-container-dark' style={{width: '90%'}}>
                        <Form autoComplete='off' className='d-flex flex-column justify-content-center align-items-center'>
                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                <Form.Label style={{fontWeight: '600'}}>Sort</Form.Label>
                                <InputGroup style={{marginTop: '0px'}}>
                                    <Form.Select id='portfolioSort' onChange={(e) => {sortTokens(e.target.value)}}>
                                        <option value=''>Sort by</option>
                                        <option value='topPrice'>Top Price</option>
                                        <option value='lowPrice'>Low Price</option>
                                        <option value='newest'>Newest</option>
                                        <option value='oldest'>Oldest</option>
                                    </Form.Select>
                                </InputGroup>
                                <br/>
                                <Form.Label style={{fontWeight: '600'}}>Search</Form.Label>
                                <InputGroup style={{marginTop: '0px'}}>
                                    <Form.Control type="text" id='searchInput' placeholder="address, username or title." onKeyDown={onKeyDown} onKeyUp={(e) => {search(e.target.value.toUpperCase())}} />
                                </InputGroup>
                            </div>
                        </Form>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        )
    }

    return (
        <>
        <Navbar variant="dark" expand="lg" fixed='top'>
        <Container>
            <Navbar.Brand href={PATHS.main} style={{fontWeight: 'bold'}}>
                <img
                    alt="TROCA"
                    src={logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                TROCA
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href={PATHS.main}>Home</Nav.Link>                    
                    {isMember ? <Nav.Link href={PATHS.auctions}>Auctions</Nav.Link> : <></>}
                    {isMember ? <Nav.Link href={PATHS.mint}>Mint</Nav.Link> : <></>}                    
                    {isConnected ? <Nav.Link href={PATHS.orderBook}>Order Book</Nav.Link> : <></>}
                    {isConnected ? <Nav.Link href={PATHS.portfolio}>Portfolio</Nav.Link> : <></>}
                </Nav>
                {getMenuActions()}                
            </Navbar.Collapse>
        </Container>
        </Navbar>
        {generateSideMenu()}
        </>
    );
}

export default Menu;

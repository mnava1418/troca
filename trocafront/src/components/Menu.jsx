import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { useSelector, useDispatch } from 'react-redux';

import { connectionStatusSelector } from '../store/slices/statusSlice'
import { parseAccount } from '../services/ethServices';
import { PATHS } from '../config'
import User from '../models/User';
import logo from '../img/logoTransparent.png'

function Menu() {
    const { isConnected, isOnline, account, isMember, isOwner, socket } = useSelector(connectionStatusSelector)
    const dispatch = useDispatch()
    const user = new User(dispatch)
    
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

    const getUserActions = () => {
        return(
            <Nav>
                <OverlayTrigger
                    key={`overlay-account`}
                    placement={`bottom`}
                    overlay={
                        <Tooltip id={`tooltip-account`}>
                            {account}
                        </Tooltip>
                    }
                >
                    <Nav.Link href={PATHS.profile}>{
                        isMember ? 
                            <>{parseAccount(account)} <i className='bi bi-patch-check-fill' style={ isOwner ? {color: 'gold'} : {}} /></>
                        :
                            parseAccount(account) 
                        }
                    </Nav.Link>
                </OverlayTrigger>
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

    return (
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
                    {isOwner ? <Nav.Link href={PATHS.create}>Create</Nav.Link> : <></>}
                    {isMember ? <Nav.Link href={PATHS.mint}>Mint</Nav.Link> : <></>}                    
                    {isConnected ? <Nav.Link href={PATHS.orderBook}>Order Book</Nav.Link> : <></>}
                    {isConnected ? <Nav.Link href={PATHS.portfolio}>Portfolio</Nav.Link> : <></>}
                </Nav>
                {getMenuActions()}                
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Menu;
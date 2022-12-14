import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { useSelector } from 'react-redux';

import { connectionStatusSelector } from '../store/slices/statusSlice'
import { PATHS } from '../config'

function Menu() {
    const { isConnected, isOnline, account } = useSelector(connectionStatusSelector)
    
    const handleConnectWallet = () => {
        window.location.href = PATHS.wallet
    }

    const getWalletAction = () => {
        return(
            <Form className="d-flex">
                <Button variant="outline-light" style={{fontWeight: '600'}} onClick={handleConnectWallet}><i className="bi bi-wallet-fill" style={{marginRight: '8px'}}/>Wallet</Button>
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
                    <Nav.Link href={PATHS.profile}>{`${account.substring(0,5)}...${account.substring(account.length - 4)}`}</Nav.Link>
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
                    <Nav.Link href="#"><Spinner animation='grow' variant={ isOnline ? 'success' : 'danger'} size='sm'/></Nav.Link>
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
        <Navbar bg="dark" variant="dark" expand="lg" fixed='top'>
        <Container>
            <Navbar.Brand href={PATHS.main} style={{fontWeight: 'bold'}}>
                TROCA</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href={PATHS.main}>Home</Nav.Link>
                </Nav>
                {getMenuActions()}                
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Menu;
import logo from '../logo.svg'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { PATHS } from '../config'

function Menu() {
    const handleConnectWallet = () => {
        window.location.href = PATHS.wallet
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed='top'>
        <Container>
            <Navbar.Brand href={PATHS.main}>
                <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />{' '}
                Troca</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Form className="d-flex">
                <Button variant="outline-light" style={{fontWeight: 'bold'}} onClick={handleConnectWallet}><i className="bi bi-wallet-fill" style={{marginRight: '8px'}}/>Connect Wallet</Button>
            </Form>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Menu;
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { INFURA_URL } from '../config';

import '../styles/NFTCard.css'

function NFTCard({img, title, description, onlyUser}) {

    const cardAction = (action) => {
        switch (action) {
            case 'bid':
                alert('Vamo a ofertar')
                break;

            case 'buy':
                alert('Vamo a comprar')
                break;

            case 'mint':
                alert('Vamo a mintear')
                break;

            case 'update':
                alert('Vamo a actualizar')
                break;
    
            default:
                alert('No estes chingando')
                break;
        }
    }

    const getOwnerActions = () => {
        return(
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('mint')}}>Mint</Button>
                <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('update')}}>Update</Button>
            </div>
        )
    }

    const getUserActions = () => {
        return(
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <Button variant="primary" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('bid')}}>Place Bid</Button>
                <Button variant="outline-light" style={{width: '100px', margin: '16px'}} onClick={() => {cardAction('buy')}}>Buy</Button>
            </div>
        )
    }

    return (
        <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container' style={{ width: '20rem', margin: '40px' }}>
            <div className='nft-card-img bg-img bg-im-cover' style={{backgroundImage: `url(${INFURA_URL}/${img})`}} />
            <Card.Body className='d-flex flex-column justify-content-end align-items-center' style={{width: '90%'}}>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <hr style={{width: '100%'}}></hr>
                {onlyUser ? getOwnerActions() : getUserActions()}
            </Card.Body>
        </Card>
    );
  }
  
  export default NFTCard;
  
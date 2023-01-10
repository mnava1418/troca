import Card from 'react-bootstrap/Card'

import '../../styles/Card.css'

function CardLink({id, title, text, iconStyle}) {
    return (
        <Card
            id={id}
            bg='secondary'
            key='walletCard'
            text='white'
            style={{ width: '18rem'}}
            className="mb-2 card-link-cust"
            border="light"
        >
            <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
            <div className='card-img-cust d-flex flex-column justify-content-center align-items-center' style={{marginBottom: '8px'}}>
                <div className={`bg-img bg-im-contain card-img-cust-icon ${iconStyle}`}/>
            </div>
            <Card.Title><h3>{title}</h3></Card.Title>
            <Card.Text>{text}</Card.Text>
            </Card.Body>
        </Card>
    );
  }
  
  export default CardLink;
  
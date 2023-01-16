import Button from 'react-bootstrap/Button';

import '../../styles/Main.css'

function Main() {
    return (
      <main className="full-screen full-screen-transparency bg-img bg-im-cover d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-column justify-content-center align-items-center main-container">
          <div className='d-flex flex-column justify-content-center align-items-center main-content'>
            <h1>
              TROCA, the easiest way to trade your NFTs.
            </h1>
            <h4>
              Create your own NFTs and start trading. You can sell them or exchange them with other users from the network.
            </h4>
            <br />
            <div className='d-flex justify-content-center align-items-center main-actions'>
              <Button variant="primary" style={{fontWeight: '600'}}>Explore More</Button>
              <Button variant="outline-light" style={{fontWeight: '600'}}>Become a Member</Button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  export default Main;
  
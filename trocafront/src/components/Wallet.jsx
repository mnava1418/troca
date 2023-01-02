import CardLink from './helpers/CardLink';

function Wallet() {
    return (
      <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
        <h1>Connect Your Wallet</h1>
        <h4>Use MetaMask to start trading your NFTs.</h4>
        <CardLink title='MetaMask' text='Aqui vamos a poner todo el show' iconStyle='card-img-metamask'/>
      </section>
    );
  }
  
  export default Wallet;
  
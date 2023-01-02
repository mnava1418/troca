import { useEffect } from 'react';
import CardLink from './helpers/CardLink';

import { isMetamaskAvailable } from '../services/ethServices'

function Wallet() {
    const cardText = isMetamaskAvailable() ? 'Click to connect your wallet and start using the dapp.' : 'Click to download MetaMask. Follow instructions on the MetaMask website.'
    
    useEffect(() => {
      document.getElementById('metaMaskCard').addEventListener('click', handleConnection)
      // eslint-disable-next-line
    }, [])

    const handleConnection = () => {
      if(isMetamaskAvailable()) {
        console.log('Vamos a conectar con Metamask')
      } else {
        window.open('https://metamask.io/download/', '_blank');
      }
    }
    
    return (
      <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
        <h1>Connect Your Wallet</h1>
        <h4>Use MetaMask to start trading your NFTs.</h4>
        <CardLink id={'metaMaskCard'} title='MetaMask' text={cardText} iconStyle='card-img-metamask'/>
      </section>
    );
  }
  
  export default Wallet;

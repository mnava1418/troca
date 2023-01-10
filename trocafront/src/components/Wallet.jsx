import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'

import CardLink from './helpers/CardLink';
import User from '../models/User';
import { isMetamaskAvailable } from '../services/ethServices'
import { closeAlert, isProcessingSelector, connectionStatusSelector } from '../store/slices/statusSlice'


function Wallet() {
    const cardText = isMetamaskAvailable() ? 'Click to connect your wallet and start using the dapp.' : 'Click to download MetaMask. Follow instructions on the MetaMask website.'
    const dispatch = useDispatch()
    const isProcessing = useSelector(isProcessingSelector)
    const { isConnected } = useSelector(connectionStatusSelector)
    
    useEffect(() => {
      document.getElementById('metaMaskCard').addEventListener('click', handleConnection)
      // eslint-disable-next-line
    }, [])

    const handleConnection = () => {
      dispatch(closeAlert())

      if(isMetamaskAvailable()) {
        const user = new User(dispatch)
        user.login()
      } else {
        window.open('https://metamask.io/download/', '_blank');
      }
    }

    const showActions = () => {
      if(isConnected) {
        return <i class="bi bi-check-circle" style={{fontSize: '100px', color: 'green'}}></i>        
      } else {
        return <CardLink id={'metaMaskCard'} title='MetaMask' text={cardText} iconStyle='card-img-metamask'/>
      }
    }
    
    return (
      <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
        <h1>Connect Your Wallet</h1>
        <h4 style={{marginBottom: '24px'}}>Use MetaMask to start trading your NFTs.</h4>
        {isProcessing ? <Spinner animation='grow' variant='secondary'/> : showActions()}
      </section>
    );
  }
  
  export default Wallet;
  
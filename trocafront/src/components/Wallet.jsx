import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'

import CardLink from './helpers/CardLink';
import User from '../models/User';
import { isMetamaskAvailable } from '../services/ethServices'
import { closeAlert, isProcessingSelector } from '../store/slices/statusSlice'


function Wallet() {
    const cardText = isMetamaskAvailable() ? 'Click to connect your wallet and start using the dapp.' : 'Click to download MetaMask. Follow instructions on the MetaMask website.'
    const dispatch = useDispatch()
    const isProcessing = useSelector(isProcessingSelector)

    //const alert = useSelector(alertSelector)

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

    const getContent = () => {
      return(
        <CardLink id={'metaMaskCard'} title='MetaMask' text={cardText} iconStyle='card-img-metamask'/>
      )
    }
    
    return (
      <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
        <h1>Connect Your Wallet</h1>
        <h4>Use MetaMask to start trading your NFTs.</h4>
        {isProcessing ? <Spinner animation='grow' variant='secondary' style={{marginTop: '24px'}}/> : getContent()}
      </section>
    );
  }
  
  export default Wallet;

  //{isProcessing ? <Spinner animation='grow' /> : getMainButton()}

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { connectionStatusSelector } from '../../store/slices/statusSlice';
import { usdToEth } from '../../services/ethServices';
import { MEMBERSHIP_FEE } from '../../config';
import User from '../../models/User';
import useWeb3 from '../../hooks/useWeb3';

import TrocaModal from '../helpers/TrocaModal';
import Button from 'react-bootstrap/Button';

import '../../styles/Main.css'

function Main() {
    const { isConnected, isMember, account } = useSelector(connectionStatusSelector)
    const { web3, troca } = useWeb3()

    const [showModal, setShowModal] = useState(false)
    const [fee, setFee] = useState('0')

    const dispatch = useDispatch()
    const user = new User(dispatch)

    const becomeMember = async() => {
      const currentFee = await usdToEth(MEMBERSHIP_FEE).then(result => result.toFixed(5))
      setFee(currentFee.toString())
      setShowModal(true)

    }

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
              {(isConnected && !isMember) ?<Button variant="outline-light" style={{fontWeight: '600'}} onClick={becomeMember}>Become a Member</Button> : <></>}
            </div>
          </div>
        </div>
        <TrocaModal 
          body={<span>We will charge <b>{fee} ETH / 10 USD</b> as a one-time payment for membership.</span>} 
          title='Become a Member' 
          action={() => user.becomeMember(account, troca, web3, fee)}
          dispatch={dispatch}
          setShowModal={setShowModal}
          showModal={showModal} />
      </main>
    );
  }
  
  export default Main;
  
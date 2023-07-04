import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'
import TrocaModal from './helpers/TrocaModal';
import User from '../models/User';

import { 
    connectionStatusSelector, 
    isProcessingSelector, 
    setIsProcessing, 
    updateUserName,
    closeAlert
} from '../store/slices/statusSlice';

import useWeb3 from '../hooks/useWeb3';
import { parseAccount, usdToEth } from '../services/ethServices';
import { PATHS, INFURA_URL, MEMBERSHIP_FEE } from '../config';

import '../styles/Main.css'
import '../styles/Profile.css'

function Profile() {
    const [validated, setValidated] = useState(false)
    const [imgFile, setImgFile] = useState(undefined)
    const [showModal, setShowModal] = useState(false)
    const [fee, setFee] = useState('0')
    const [isRegistered, setIsRegistered] = useState(false)

    const { isConnected, account, userInfo, isMember } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)

    const { web3, troca } = useWeb3()
    
    const dispatch = useDispatch()
    const user = new User(dispatch)

    useEffect(() => {
        const getInfo = async() => {
            const {img, email} = await user.getUserInfo()

            if(email !== undefined && email !== '') {
                setIsRegistered(true)
            }
            
            if(img && img.trim() !== '') {
                document.getElementById('profileImg').style.backgroundImage = `url("${INFURA_URL}/${img}")`
                document.getElementById('profileImg').innerHTML = ''
            }
        }

        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else {            
            getInfo()
        } 
        
        // eslint-disable-next-line
    }, [isConnected])

    const handleSubmit = async (action) => {
        const form = document.getElementById('profileForm')
        if (form.checkValidity()) {
            dispatch(setIsProcessing(true))
            dispatch(closeAlert())

            if(action === 'save') {
                const email = document.getElementById('userEmail').value
                const username = document.getElementById('userName').value
                user.updateUserInfo(email, username, userInfo.img, imgFile, setIsRegistered)
            } else {
                const currentFee = await usdToEth(MEMBERSHIP_FEE).then(result => result.toFixed(5))
                setFee(currentFee.toString())
                setShowModal(true)
            }
        } else {
            setValidated(true);
        }
    };

    const getMembetButton = () => {
        if(!isMember && isRegistered) {
            return(
                <Form.Group controlId="memberBtn">
                    <Button variant="outline-light" style={{fontWeight: '600'}} onClick={() => handleSubmit('member')}>Become a Member</Button>
                </Form.Group>
            )
        } else {
            return (<></>)
        }
    }
    const getActionButtons = () => {
        return(
            <>
                <Form.Group controlId="saveBtn">
                    <Button variant="primary" style={{fontWeight: '600'}} onClick={() => handleSubmit('save')}>Save Info</Button>
                </Form.Group>
                {getMembetButton()}
            </>
        )
    }

    const loadImage = () => {
        const file = document.getElementById('profileImgFile').files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            document.getElementById('profileImg').style.backgroundImage = `url(${reader.result})`
            document.getElementById('profileImg').innerHTML = ''            
            setImgFile(file)
        }

        if(file) {
            reader.readAsDataURL(file)
        }
    }

    const showPage = () => {
        return (
            <section className="profile-background full-screen bg-img bg-im-cover d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center main-container" style={{width: '100%'}}>
                <div className='d-flex flex-column justify-content-center align-items-center dark-container profile-container form-container form-container-dark'>
                    <div id="profileImg" className='d-flex flex-column justify-content-center align-items-center profile-img bg-img bg-im-cover' onClick={() => {document.getElementById('profileImgFile').click()}}>
                        <i className="bi bi-person" style={{fontSize: '60px'}}/>
                    </div>
                    <Form.Control id="profileImgFile" type="file" accept="image/*" hidden onChange={() => {loadImage()}}/>
                    <h2>
                        {userInfo.username !== '' ? userInfo.username : 'Username'}
                    </h2>
                    <h5>
                        {parseAccount(account)}
                    </h5>
                    <Form id='profileForm' noValidate validated={validated} autoComplete='off'>
                        <Form.Group controlId="userName">
                            <Form.Label style={{fontWeight: '600'}}>Username</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Set your username"
                                defaultValue={userInfo.username}
                                onChange={(e) => {dispatch(updateUserName(e.target.value))}}
                            />
                            <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Choose a username.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="userEmail">
                            <Form.Label style={{fontWeight: '600'}}>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter your email"
                                defaultValue={userInfo.email}
                            />
                            <Form.Control.Feedback type="invalid" style={{margin: '8px 0px 0px 0px'}}>Provide a valid email.</Form.Control.Feedback>
                        </Form.Group>
                        {!isProcessing ? getActionButtons() : <></>}
                    </Form>
                    {isProcessing ? <Spinner animation='grow' variant='secondary'/> : <></>}
                </div>
              </div>
              <TrocaModal 
                body={<span>We will charge <b>{fee} ETH / 10 USD</b> as a one-time payment for membership.</span>} 
                title='Become a Member' 
                action={() => user.becomeMember(account, troca, web3, fee)}
                dispatch={dispatch}
                setShowModal={setShowModal}
                showModal={showModal} />
            </section>
        )
    }

    return (
        <>
            {isConnected ? showPage() : <Spinner animation='grow' variant='secondary'/>}
        </>
      );
  }
  
  export default Profile;
  
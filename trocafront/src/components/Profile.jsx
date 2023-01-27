import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'
import User from '../models/User';

import { 
    connectionStatusSelector, 
    isProcessingSelector, 
    setIsProcessing, 
    updateUserName,
    closeAlert
} from '../store/slices/statusSlice';

import { parseAccount } from '../services/ethServices';
import { PATHS, INFURA_URL } from '../config';

import '../styles/Main.css'
import '../styles/Profile.css'

function Profile() {
    const [validated, setValidated] = useState(false);
    const [imgFile, setImgFile] = useState(undefined)

    const { isConnected, account, userInfo } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)
    
    const dispatch = useDispatch()
    const user = new User(dispatch)

    useEffect(() => {
        const getInfo = async() => {
            const {img} = await user.getUserInfo()
            
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

    const handleSubmit = (action) => {
        const form = document.getElementById('profileForm')
        if (form.checkValidity()) {
            dispatch(setIsProcessing(true))
            dispatch(closeAlert())

            if(action === 'save') {
                const email = document.getElementById('userEmail').value
                const username = document.getElementById('userName').value
                user.updateUserInfo(email, username, userInfo.img, imgFile)
            } else {
                alert('Vamoasernos miembros')
            }

        } else {
            setValidated(true);
        }
    };

    const getMembetButton = () => {
        if(!userInfo.isMember) {
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
            <section className="profile-background full-screen full-screen-transparency bg-img bg-im-cover d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center main-container" style={{width: '100%'}}>
                <div className='d-flex flex-column justify-content-center align-items-center profile-container'>
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
                        {!isProcessing ? getActionButtons() : <></>}
                    </Form>
                    {isProcessing ? <Spinner animation='grow' variant='secondary'/> : <></>}
                </div>
              </div>
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
  
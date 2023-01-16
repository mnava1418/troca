import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Landing from './components/landing/Landing';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import CustomAlert from './components/helpers/CustomAlert';
import Spinner from 'react-bootstrap/Spinner'

import User from './models/User';
import { PATHS } from './config'
import { alertSelector } from './store/slices/statusSlice'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css';

function App() {
  const alert = useSelector(alertSelector)
  const [localProcessing, setLocalProcessing] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkConnectionStatus = async () => {
      const currentUser = new User(dispatch)
      await currentUser.isConnected()
      setLocalProcessing(false)
    }

    checkConnectionStatus()
    // eslint-disable-next-line
  }, [])

  const showApp = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.main} element={<Landing />}/>
          <Route path={PATHS.wallet} element={<Wallet />}/>
          <Route path={PATHS.profile} element={<Profile />}/>
          <Route  path='*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <div className="App">
      <Menu />
      {alert.show ? <CustomAlert type={alert.type} title={alert.title} text={alert.text} /> : <></>}
      {localProcessing ? <Spinner animation='grow' variant='secondary'/> : showApp()}      
    </div>
  );
}

export default App;

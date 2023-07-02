import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Landing from './components/landing/Landing';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Create from './components/Create';
import Portfolio from './components/Portfolio';
import Mint from './components/Mint';
import CustomAlert from './components/helpers/CustomAlert';
import Exchange from './components/Exchange';
import Spinner from 'react-bootstrap/Spinner'
import OrderBook from './components/OrderBook';

import User from './models/User';
import { PATHS } from './config'
import { alertSelector, closeAlert } from './store/slices/statusSlice'
import { showExchangeSelector } from './store/slices/exchangeSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css';

function App() {
  const alert = useSelector(alertSelector)
  const showExchange = useSelector(showExchangeSelector)
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
      <>
        <BrowserRouter>
          <Routes>
            <Route path={PATHS.main} element={<Landing />}/>
            <Route path={PATHS.wallet} element={<Wallet />}/>
            <Route path={PATHS.profile} element={<Profile />}/>
            <Route path={PATHS.create} element={<Create />}/>
            <Route path={PATHS.portfolio} element={<Portfolio />}/>
            <Route path={PATHS.mint} element={<Mint />}/>
            <Route path={PATHS.orderBook} element={<OrderBook />}/>
            <Route  path='*' element={<NotFound />}/>
          </Routes>
        </BrowserRouter>
        {showExchange ? <Exchange /> : <></>}
      </>
    )
  }

  const showAlert = () => {
    setTimeout(() => {
      dispatch(closeAlert())
    }, 5000)

    return(<CustomAlert type={alert.type} text={alert.text} action={alert.action} actionId={alert.actionId} />)
  }

  return (
    <div className="App bg-img bg-im-cover">
      <Menu />
      {alert.show ? showAlert() : <></>}
      {localProcessing ? <Spinner animation='grow' variant='secondary'/> : showApp()}      
    </div>
  );
}

export default App;

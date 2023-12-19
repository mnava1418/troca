import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Landing from './components/landing/Landing';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Portfolio from './components/Portfolio';
import Mint from './components/Mint';
import CustomAlert from './components/helpers/CustomAlert';
import Exchange from './components/Exchange';
import Spinner from 'react-bootstrap/Spinner'
import OrderBook from './components/OrderBook';
import Auctions from './components/Auctions';

import User from './models/User';
import { alertSelector, closeAlert, setShowNftFilter } from './store/slices/statusSlice'
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
      dispatch(setShowNftFilter(false))
    }
    
    checkConnectionStatus()
    // eslint-disable-next-line
  }, [])

  const showApp = () => {
    return (
      <>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path='/' element={<Landing />}/>
            <Route path='/wallet' element={<Wallet />}/>
            <Route path='/profile' element={<Profile />}/>            
            <Route path='/portfolio' element={<Portfolio />}/>
            <Route path='/mint' element={<Mint />}/>
            <Route path='/orderBook' element={<OrderBook />}/>
            <Route path='/auctions' element={<Auctions />}/>
            <Route  path='*' element={<NotFound />}/>
          </Routes>
        </Router>
        {showExchange ? <Exchange /> : <></>}
      </>
    )
  }

  const showAlert = () => {
    setTimeout(() => {
      dispatch(closeAlert())
    }, 6000)

    return(<CustomAlert type={alert.type} text={alert.text} action={alert.action} actionId={alert.actionId} />)
  }

  return (
    <div className="App">
      <Menu />
      {alert.show ? showAlert() : <></>}
      {localProcessing ? <Spinner animation='grow' variant='secondary'/> : showApp()}      
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux'

import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Landing from './components/landing/Landing';
import Wallet from './components/Wallet';
import CustomAlert from './components/helpers/CustomAlert';
import { PATHS } from './config'
import { alertSelector } from './store/slices/statusSlice'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css';

function App() {
  const alert = useSelector(alertSelector)

  return (
    <div className="App">
      <Menu />
      {alert.show ? <CustomAlert type={alert.type} title={alert.title} text={alert.text} /> : <></>}
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.main} element={<Landing />}/>
          <Route path={PATHS.wallet} element={<Wallet />}/>
          <Route  path='*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

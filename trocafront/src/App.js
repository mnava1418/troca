import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Main from './components/Main';
import Wallet from './components/Wallet';
import { PATHS } from './config'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {
  return (
    <div className="App">
      <Menu />
      <BrowserRouter>
        <Routes>
          <Route path={PATHS.main} element={<Main />}/>
          <Route path={PATHS.wallet} element={<Wallet />}/>
          <Route  path='*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

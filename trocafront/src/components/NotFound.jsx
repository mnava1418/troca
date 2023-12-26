import Button from 'react-bootstrap/Button'

import { PATHS } from '../config';

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center full-screen" style={{textAlign: 'center'}}>
      <h1 style={{fontSize: '72px'}}>404 Not Found</h1>
      <p style={{fontSize: '24px', textAlign: 'center', marginBottom: '40px'}}>Sorry, the page you are looking for is not available.</p>
      <Button variant="primary" onClick={() => {window.location.href = PATHS.main}}>Go Home</Button>
    </div>
  );
}

export default NotFound;

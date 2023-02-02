import Alert from 'react-bootstrap/Alert'
import { useDispatch } from 'react-redux';

import { closeAlert } from '../../store/slices/statusSlice'

function CustomAlert({type, text}) {
    const dispatch = useDispatch()

    return (
        <Alert variant={type} onClose={() => dispatch(closeAlert())} dismissible className='custom-alert'>            
            <p>
            {text}
            </p>
        </Alert>
    );
  }
  
  export default CustomAlert;
  
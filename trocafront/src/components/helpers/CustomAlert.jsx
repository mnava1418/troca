import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert'

import { closeAlert } from '../../store/slices/statusSlice'

function CustomAlert({type, text, actionId, action}) {
    const dispatch = useDispatch()

    useEffect(() =>{
        document.getElementById('alertText').innerHTML = text

        if(actionId) {
            document.getElementById(actionId).addEventListener('click', action);
        }

        // eslint-disable-next-line
    }, [])
    
    return (
        <Alert variant={type} onClose={() => dispatch(closeAlert())} dismissible className='custom-alert'>
            <Alert.Heading>{type === 'danger' ? 'Error!' : type === 'success' ? 'Success!' : 'Warning!'}</Alert.Heading>            
            <p id='alertText' />
        </Alert>
    );
  }
  
  export default CustomAlert;
  
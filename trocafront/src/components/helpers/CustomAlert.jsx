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
            <div className='d-flex flex-row justify-content-center align-items-center'>                       
                <p id='alertText' style={{margin: '0px'}}/>
            </div>
        </Alert>
    );
  }
  
  export default CustomAlert;
  
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { setIsProcessing } from '../../store/slices/statusSlice'

function TrocaModal({showModal, setShowModal, action, title, body, dispatch}) {
    const handleClose = () => {
      setShowModal(false)
      dispatch(setIsProcessing(false))
    }

    const handleContinue = () => {
      setShowModal(false)
      action()
    }

    return (        
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
            <Button variant="outline-light" onClick={handleClose} style={{fontWeight: '600'}}>
                Close
            </Button>
            <Button variant="primary" onClick={handleContinue} style={{fontWeight: '600'}}>
                Continue
            </Button>
            </Modal.Footer>
        </Modal>
    );
  }
  
  export default TrocaModal;
 
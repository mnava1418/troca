import { useState } from 'react'

function useNFTCard() {
    const [tokenImg, setTokenImage] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [modal, setModal] = useState({})
    
    return {
        tokenImg, setTokenImage,
        showModal, setShowModal,
        modal, setModal
    }
}

export default useNFTCard
import { useState } from 'react'

function useNFTCard() {
    const [tokenImg, setTokenImage] = useState({})
    const [showModal, setShowModal] = useState(false)
    
    return {
        tokenImg, setTokenImage,
        showModal, setShowModal,
    }
}

export default useNFTCard
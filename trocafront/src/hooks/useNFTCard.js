import { useState } from 'react'

function useNFTCard() {
    const [tokenImg, setTokenImage] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [listAll, setListAll] = useState(false)

    return {
        tokenImg, setTokenImage,
        showModal, setShowModal,
        listAll, setListAll
    }
}

export default useNFTCard
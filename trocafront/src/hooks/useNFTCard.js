import { useState } from 'react'

function useNFTCard(isListed) {
    const [tokenImg, setTokenImage] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [nftIsListed, setNftIsListed] = useState(isListed)

    return {
        tokenImg, setTokenImage,
        showModal, setShowModal,
        nftIsListed, setNftIsListed
    }
}

export default useNFTCard
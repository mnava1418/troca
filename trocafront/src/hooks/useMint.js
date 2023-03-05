import { useState } from 'react'
import { MINTING_STATUS } from '../config'

function useMint() {
    const [isMinting, setIsMinting] = useState(false)
    const [showNFT, setShowNFT] = useState('')
    const [animateCard, setAnimateCard] = useState('')
    const [animateLogo, setAnimateLogo] = useState('')
    const [status, setStatus] = useState('')    

    const animate = () => {
        setAnimateCard('nft-card-animate')
        setAnimateLogo('nft-card-back-animate')
    }

    const stopAnimation = () => {
        setAnimateCard('')
        setAnimateLogo('')
    }

    const showMintingStatus = (status, total = 0, available = 0) => {
        switch (status) {
            case MINTING_STATUS.minting:
                setStatus('A new NFT is being minted!')
                break;
        
            default:
                setStatus(`NFT's remaining to mint: ${available}/${total}`)
                break;
        }
    }

    return {
        isMinting, setIsMinting,
        showNFT,
        animate, animateCard, animateLogo, stopAnimation,
        status, showMintingStatus        
    }
}

export default useMint

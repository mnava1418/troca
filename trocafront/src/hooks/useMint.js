import { useState } from 'react'

function useMint() {
    const [isMinting, setIsMinting] = useState(false)
    const [showNFT, setShowNFT] = useState('')
    const [animateCard, setAnimateCard] = useState('')
    const [animateLogo, setAnimateLogo] = useState('')

    const animate = () => {
        setAnimateCard('nft-card-animate')
        setAnimateLogo('nft-card-back-animate')
    }

    return {
        isMinting, setIsMinting,
        showNFT,
        animate, animateCard, animateLogo
    }
}

export default useMint

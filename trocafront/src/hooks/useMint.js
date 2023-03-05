import { useState } from 'react'
import { MINTING_STATUS } from '../config'

function useMint() {
    const [isMinting, setIsMinting] = useState(false)
    const [showNFT, setShowNFT] = useState('')
    const [animateCard, setAnimateCard] = useState('')
    const [animateLogo, setAnimateLogo] = useState('')
    const [status, setStatus] = useState('')    
    const [title, setTitle] = useState('Mint an NFT')
    const [subtitle, setSubtitle] = useState('Click to mint your next NFT.')

    const startMinting = () => {
        setIsMinting(true)        
        setTitle('In Progress...')
        setSubtitle('Please DO NOT LEAVE this page until transaction is confirmed!')
        startAnimation()
    }

    const startAnimation = () => {
        setAnimateCard('nft-card-animate')
        setAnimateLogo('nft-card-back-animate')
    }

    const stopAnimation = () => {
        setAnimateCard('')
        setAnimateLogo('')
    }

    const showError = () => {
        setTitle('Ooops, Something went wrong')
        setSubtitle(`Please check your balance and try again later. We haven't charged anything.`)
        stopAnimation()
    }

    const showMintingStatus = (status, total = 0, available = 0) => {
        switch (status) {
            case MINTING_STATUS.minting:
                setStatus('Someone else is minting!')
                break;
        
            default:
                setStatus(`NFT's remaining to mint: ${available}/${total}`)
                break;
        }
    }

    return {
        isMinting, setIsMinting, startMinting,
        showNFT,
        animateCard, animateLogo,
        status, showMintingStatus, showError,
        title, subtitle
    }
}

export default useMint

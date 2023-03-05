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
    const [tokenURI, setTokenURI] = useState('')

    const startMinting = () => {
        setIsMinting(true)        
        setTitle('In Progress...')
        setSubtitle('Please DO NOT LEAVE this page until transaction is confirmed!')
        startAnimation()
    }

    const stopMinting = () => {
        setIsMinting(false)        
        stopAnimation()
        setTitle('Mint an NFT')
        setSubtitle('Click to mint your next NFT.')
    }

    const displayNFT = (uri) => {        
        stopAnimation()
        setShowNFT('nft-mint-container-animate')
        setTokenURI(uri)
        setTitle('Congratulations!')
        setSubtitle('Your new NFT is ready. Click on it or go to Portfolio to start playing with it.')
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
        isMinting, setIsMinting, startMinting, stopMinting, displayNFT,
        showNFT,
        animateCard, animateLogo,
        status, showMintingStatus, showError,
        title, subtitle, tokenURI
    }
}

export default useMint

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
    const [tokenImg, setTokenImg] = useState('')
    const [availableTokens, setAvailableTokens] = useState(0)

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

    const displayNFT = async (uri) => {        
        const imageFile = await fetch(uri)
        const imageData = await imageFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            stopAnimation()
            setTitle('Congratulations!')
            setSubtitle('Your new NFT is ready. Click on it or go to Portfolio to start playing with it.')
            setTokenImg(reader.result)
            setShowNFT('nft-mint-container-animate')
        }

        reader.readAsDataURL(imageData)
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

    const showMintingStatus = (status, total = 0, available = 0, newToken = false) => {
        if(status !==MINTING_STATUS.minting && available === 0 && !newToken) {
            setTitle('Unable to Mint')
            setSubtitle('Sorry, no more nfts to mint.')
        } 

        switch (status) {
            case MINTING_STATUS.minting:
                setStatus('Someone else is minting!')
                break;
        
            default:
                setStatus(`NFTs remaining to mint: ${available}/${total}`)
                break;
        }           

        setAvailableTokens(available)
    }

    return {
        isMinting, setIsMinting, startMinting, stopMinting, displayNFT,
        showNFT, availableTokens,
        animateCard, animateLogo,
        status, showMintingStatus, showError,
        title, subtitle, tokenImg
    }
}

export default useMint

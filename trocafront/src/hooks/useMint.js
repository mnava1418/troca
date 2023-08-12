import { useState } from 'react'
import { useSelector } from 'react-redux'
import { MINTING_STATUS } from '../config'

import { connectionStatusSelector } from '../store/slices/statusSlice'

function useMint() {
    //MINTING STATUS
    const [isMinting, setIsMinting] = useState(false)
    const [showNFT, setShowNFT] = useState('')
    const {balanceOf, mintLimit} = useSelector(connectionStatusSelector)
    
    //ANIMATION
    const [animateCard, setAnimateCard] = useState('')
    const [animateLogo, setAnimateLogo] = useState('')
    const [tokenImg, setTokenImg] = useState('')

    //LABELS    
    const [header, setHeader] = useState('Mint an NFT')
    const [subtitle, setSubtitle] = useState('')
        
    //const [availableTokens, setAvailableTokens] = useState(0)

    const updateLabels = (txt_header, txt_subtitle) => {
        setHeader(txt_header)
        setSubtitle(txt_subtitle)    
    }

    const startMinting = () => {
        setIsMinting(true)
        updateLabels('Please wait!', 'Our AI is generating your NFT :)')
        startAnimation()
    }

    const stopMinting = () => {
        setIsMinting(false)   
        updateLabels('Mint an NFT', '')     
        stopAnimation()
    }

    const displayNFT = async (uri) => {        
        const imageFile = await fetch(uri)
        const imageData = await imageFile.blob()

        const reader = new FileReader()

        reader.onloadend = () => {
            stopAnimation()
            setIsMinting(false)        
            updateLabels('Your new NFT is ready!', 'Please wait for the transaction to be confirmed.')     
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
        updateLabels('Ooops, Something went wrong', `Please check your balance and try again later. We haven't charged anything.`)     
        stopAnimation()
        setIsMinting(false)        
    }

    const showMintingStatus = (status) => {
        switch (status) {
            case MINTING_STATUS.minting:
                updateLabels('Mint an NFT', 'Someone else is minting!')
                break;
            case MINTING_STATUS.waiting_confirmation:
                updateLabels('Ready to Mint!', 'Please DO NOT LEAVE this page until transaction is confirmed.')     
                break;        
            default:
                break;
        }           
    }

    const mintingStatus = {isMinting, showNFT, balanceOf, mintLimit}
    const animation = {tokenImg, animateCard, animateLogo}
    const labels = {header, subtitle}
    const actions = {startMinting, stopMinting, displayNFT, showError, showMintingStatus}

    return {mintingStatus, animation, labels, actions}
}

export default useMint

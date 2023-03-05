import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';

import { connectionStatusSelector } from '../store/slices/statusSlice';
import useMint from '../hooks/useMint';
import { PATHS } from '../config';
import {setListeners} from '../services/socketServices'

import '../styles/NFTCard.css'

function Mint() {    
    const { isConnected, isMember, socket, account } = useSelector(connectionStatusSelector)    
    
    const {
        isMinting, setIsMinting,
        animate, animateCard, animateLogo, stopAnimation,
        showNFT,
        status, showMintingStatus,        
    } = useMint()

    const mintNFT = () => {
        if(!isMinting) {
            setIsMinting(true)
            animate()
            socket.emit('generate-token')
        }
    }

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        } else {
            setListeners(account, socket, {showMintingStatus, stopAnimation, setIsMinting})
            socket.emit('tokens-available')
        }

        // eslint-disable-next-line
    }, [isConnected, isMember])

    return(
        <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
            <h1>Mint an NFT</h1>            
            <h4 style={{marginBottom: '60px'}}>Click to mint your next NFT.</h4>
            <div className={`nft-mint-container ${showNFT}`}>
                <Card className={`d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-shadow nft-card-back ${animateCard}`} style={{ width: '20rem', height: '20rem' }} onClick={mintNFT}>
                    <div className={`nft-card-back-img bg-img bg-im-contain ${animateLogo}`} />
                </Card>    
                <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-front' style={{ width: '20rem', height: '20rem' }}>
                    <h1>TU NFT</h1>
                </Card>
            </div>            
            <br/>
            <h4 style={{marginTop: '40px'}}>{status}</h4>
        </section>       
    )
}

export default Mint
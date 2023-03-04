import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';

import { connectionStatusSelector } from '../store/slices/statusSlice';
import useMint from '../hooks/useMint';
import { PATHS } from '../config';

import '../styles/NFTCard.css'

function Mint() {
    
    const { isConnected, isMember } = useSelector(connectionStatusSelector)
    const {
        isMinting, setIsMinting,
        animate, animateCard, animateLogo,
        showNFT
    } = useMint()

    const mintNFT = () => {
        if(!isMinting) {
            setIsMinting(true)
            animate()
            alert('vamoa a mintear')
        }
    }

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        }
    }, [isConnected, isMember])

    return(
        <section className='d-flex flex-column justify-content-center align-items-center full-screen'>
            <h1>Mint your NFT</h1>            
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
            <h4 style={{marginTop: '40px'}}>NFT's remaining to mint: 10/10</h4>            
        </section>       
    )
}

export default Mint
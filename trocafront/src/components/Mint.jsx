import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';

import { connectionStatusSelector } from '../store/slices/statusSlice';
import useMint from '../hooks/useMint';
import useWeb3 from '../hooks/useWeb3';
import { PATHS } from '../config';
import {setMintingListeners} from '../services/socketServices'

import '../styles/NFTCard.css'

function Mint() {    

    const dispatch = useDispatch()
    const { isConnected, isMember, socket, account } = useSelector(connectionStatusSelector)    
    const { nft, troca } = useWeb3()
    
    const {
        isMinting, startMinting, stopMinting, displayNFT,
        animateCard, animateLogo,
        showNFT, availableTokens,
        status, showMintingStatus, showError,
        title, subtitle, tokenImg
    } = useMint()

    const mintNFT = (e) => {        
        e.stopPropagation()
        
        if(availableTokens > 0 && !isMinting) {
            startMinting()
            socket.emit('generate-token')
        }
    }

    const goToPortfolio = (e) => {        
        e.stopPropagation()
        window.location.href = PATHS.portfolio
    }

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        } else {
            setMintingListeners(dispatch, account, socket, {showMintingStatus, showError, stopMinting, displayNFT}, {troca, nft})
            socket.emit('tokens-available')
        }

        // eslint-disable-next-line
    }, [isConnected, isMember])

    return(
        <section className='mint-background bg-img bg-im-cover d-flex flex-column justify-content-center align-items-center full-screen'>
            <h1>{title}</h1>            
            <h4 style={{marginBottom: '60px'}}>{subtitle}</h4>
            <div className={`nft-mint-container ${showNFT}`}>
                <Card className={`d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-shadow nft-card-back ${animateCard}`} style={{ width: '20rem', height: '20rem' }} onClick={mintNFT}>
                    <div className={`nft-card-back-img bg-img bg-im-contain ${animateLogo}`} />
                </Card>    
                <Card className='d-flex flex-column justify-content-center align-items-center nft-card-container nft-card-front' style={{ width: '20rem', height: '20rem', overflow: 'hidden' }} onClick={goToPortfolio}>
                    <div className='bg-img bg-im-cover' style={{width: '100%', height: '100%', backgroundImage: `url(${tokenImg})` }}/>
                </Card>
            </div>            
            <br/>
            <h4 style={{marginTop: '40px'}}>{status}</h4>
        </section>       
    )
}

export default Mint

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'
import NFTCard from './NFTCard';

import { connectionStatusSelector, isProcessingSelector, setShowNftFilter } from '../store/slices/statusSlice';
import usePortfolio from '../hooks/usePortfolio';
import User from '../models/User';
import { PATHS } from '../config';
import { parseAccount, parseUsername } from '../services/ethServices';
import { setPortfolioListeners } from '../services/socketServices';
import { subscribeUser } from '../services/notificationServices'

function Portfolio () {
    const { isConnected, socket } = useSelector(connectionStatusSelector)
    const isProcessing = useSelector(isProcessingSelector)
    const [isProcessingLocal, setIsProcessingLocal] = useState(false)

    const { 
        onlyUser, 
        selectedTokens, 
        allUsers,        
    } = usePortfolio()
    
    const dispatch = useDispatch()
    const user = new User(dispatch)

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else {      
            user.getAllUsers()
            setPortfolioListeners(socket, setIsProcessingLocal, dispatch)
            dispatch(setShowNftFilter(true))
            subscribeUser()
        } 
        
        // eslint-disable-next-line
    }, [isConnected])
    
    const generateCatalog = () => {     
        return(
            <div className='d-flex flex-row justify-content-center flex-wrap fixed-container' style={{width: '90%'}}>
                {selectedTokens.map(token => {           
                    let owner = token.owner

                    if(allUsers[owner] !== undefined && allUsers[owner].username.trim() !== '') {
                        owner = parseUsername(`@${allUsers[owner].username.trim()}`)
                    } else {
                        owner = parseAccount(owner)
                    }
                    
                    return(
                        <NFTCard key={token.id}
                            onlyUser={onlyUser}
                            formatOwner={owner}
                            token={token}
                            isProcessingLocal={isProcessingLocal}
                            setIsProcessingLocal={setIsProcessingLocal}
                        />
                    )
                })}
            </div>
        )        
    }

    const emptyCatalog = () => {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center fixed-container' style={{width: '90%'}}>
                <h4 style={{margin: '100px 0px 24px 0px'}}>We weren't able to find NFTs.</h4>
                <i className="bi bi-emoji-frown" style={{fontSize: '100px', color: 'var(--secondary-color)'}}></i>        
            </div>
        )
    }    

    const showPage = () => {
        return(
            <section className='full-screen d-flex flex-column justify-content-start align-items-center'>                
                {selectedTokens.length > 0 ? generateCatalog() : emptyCatalog()}                
            </section>
        )
    }

    return (
        <>
            {isConnected && !isProcessing ? showPage() : <Spinner animation='grow' variant='secondary'/>}
        </>
    );
}

export default Portfolio

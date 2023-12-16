import { MINTING_STATUS } from "../config"
import MyPortfolio from "../models/MyPortfolio"
import { setAlert, updateChatUsers, userMintNFT } from "../store/slices/statusSlice"
import { INFURA_URL, BID_STATUS } from "../config"
import { updateTokenPrice, tokenInAuction } from "../store/slices/portfolioSlice"
import { showExchange, updateOrder } from "../store/slices/exchangeSlice"
import { 
    addAuctionMessage, 
    userJoin, 
    updateUserAuction,
    updateAuctionsList, 
    startAuction,
    updateAuctionPrice,
    updateStatus,
    userLeaves,
} from "../store/slices/auctionSlice"

export const setMintingListeners = (dispatch, account, socket, actions = {}, contracts = {}) => {
    socket.on('minting-token', (newToken, mintingAccount) => {
        if(newToken !== undefined && newToken !== null) {
            if(mintingAccount === account) {
                actions.showMintingStatus(MINTING_STATUS.waiting_confirmation)
                const portfolio = new MyPortfolio(dispatch)
                
                portfolio.mint(account, contracts.nft, contracts.troca, newToken)
                .then(() => {
                    socket.emit('complete-minting', newToken)
                    actions.displayNFT(`${INFURA_URL}/${newToken.image}`)
                    dispatch(userMintNFT())
                })
                .catch( errorMessage => {
                    dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
                    socket.emit('cancel-minting', newToken)
                    actions.stopMinting()
                })

            } else {
                actions.showMintingStatus(MINTING_STATUS.minting)
            }                
        } else {
            if(mintingAccount === account) {
                actions.showError()
            }            
        }
    })
}

export const setPortfolioListeners = (socket, setIsProcessingLocal, dispatch) => {
    socket.on('refresh-token', (id, price) => {
        setIsProcessingLocal(false)
        dispatch(updateTokenPrice({id, price}))
        dispatch(setAlert({show: true, type: 'success', text: 'Token updated.'}))
    })

    socket.on('token-inAuction', (id, inAuction) => {
        dispatch(tokenInAuction({id, inAuction}))
    })
}

export const setChatListeners = (socket, dispatch) => {
    socket.on('update-chat-users', (chatUsers) => {
        dispatch(updateChatUsers({chatUsers}))
    })
}

export const setExchangeListeners = (socket, dispatch) => {
    socket.on('review-bid', (order) => {
        const showOrder = localStorage.getItem('showOrder')
        const orderId = parseInt(localStorage.getItem('orderId'))
        const isOnline = localStorage.getItem('isOnline')
        
        dispatch(updateOrder({order}))

        if(order.status === BID_STATUS.reject) {
            dispatch(setAlert({
                show: true, 
                type: 'warning', 
                text: `Order <a id='orderId' href='#' style='color:#634D03' }><b>${order.id}</b></a> has been rejected.`,
                action: () => {dispatch(showExchange({show: true, order}))},
                actionId: 'orderId'
            }))
        } else if(order.status === BID_STATUS.accept) {
            dispatch(setAlert({
                show: true, 
                type: 'success', 
                text: `Order <a id='orderId' href='#' style='color:#0F5132' }><b>${order.id}</b></a> has been accepted. Please confirm the order to complete transaction.`,
                action: () => {dispatch(showExchange({show: true, order}))},
                actionId: 'orderId'
            }))
        } 

        if((isOnline === 'true' && showOrder === 'false') || (showOrder === 'true' && orderId === order.id)) {
                dispatch(showExchange({show: true, order}))
        }        
    })

    socket.on('refresh-order', (order) => {        
        dispatch(updateOrder({order}))
    })
}

export const setAuctionListeners = (socket, dispatch, actions = {}, account = '', contracts = {}) => {
    socket.on('auction-created', (auction) => {     
        actions.setIsProcessingLocal(false)

        const alertType = auction.result ? 'success' : 'danger'
        dispatch(setAlert({show: true, type: alertType, text: auction.message}))
    })

    socket.on('auction-message', (id, message) => {
        dispatch(addAuctionMessage({id, message }))        
    })

    socket.on('auction-joined', (auctionID) => {        
        dispatch(userJoin({id: auctionID}))
    })

    socket.on('auction-user-update', (auctionID) => {
        dispatch(updateUserAuction({id: auctionID}))
    })

    socket.on('auction-update-list', (auction) => {
        if(auction.result) {
            dispatch(updateAuctionsList({id: auction.auctionId, auction: auction.auctionInfo}))
        }
    })

    socket.on('auction-started', (auctionId) => {        
        dispatch(startAuction({id: auctionId}))
    })

    socket.on('auction-price-updated', (id, newPrice) => {
        dispatch(updateAuctionPrice({id, newPrice}))
    })

    socket.on('auction-pending-confirmation', (auction, status) => {                
        dispatch(updateStatus({id: auction.id, status }))

        if(auction.winner === account) {
            const portfolio = new MyPortfolio(dispatch)
            portfolio.confirmAuction(contracts.troca, contracts.nft, contracts.web3, auction.token, auction.winner)
            .then(() => {
                dispatch(setAlert({show: true, type: 'warning', text: 'Please wait for the transaction to be confirmed.'}))
                socket.emit('complete-auction', auction)
            })
            .catch((errorMessage) => {
                dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
                socket.emit('reject-auction', auction)
            })
        }
    })

    socket.on('auction-rejected', (id, status, currentAccount, newAccount, newPrice, restartAuction) => {
        dispatch(updateAuctionPrice({id, newPrice}))
        dispatch(updateStatus({id, status}))
        dispatch(userLeaves({id, isWinner: account === currentAccount }))        
        
        if(restartAuction && newAccount === account) {            
            setTimeout(() => {
                socket.emit('price-update-auction', id, newPrice)
            }, 2000)
        }        
    })

    socket.on('auction-completed', (id, status) => {
        dispatch(updateStatus({id, status}))
    })
}
import { MINTING_STATUS } from "../config"
import MyPortfolio from "../models/MyPortfolio"
import { setAlert, updateChatUsers, userMintNFT } from "../store/slices/statusSlice"
import { INFURA_URL, BID_STATUS } from "../config"
import { updateTokenPrice } from "../store/slices/portfolioSlice"
import { showExchange, updateOrder } from "../store/slices/exchangeSlice"
import { showMessage, userJoin, updateUserAuction } from "../store/slices/auctionSlice"

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

export const setAuctionListeners = (socket, dispatch, actions = {}) => {
    socket.on('auction-created', (auction) => {     
        actions.setIsProcessingLocal(false)

        const alertType = auction.result ? 'success' : 'danger'
        dispatch(setAlert({show: true, type: alertType, text: auction.message}))
    })

    socket.on('auction-message', (auctionId, message) => {
        console.log('recibimos mensaje', auctionId, message)
        //dispatch(showMessage({id: auctionId, message }))        
    })

    socket.on('auction-joined', (auctionID) => {        
        dispatch(userJoin({id: auctionID}))
    })

    socket.on('auction-user-update', (auctionID) => {
        dispatch(updateUserAuction({id: auctionID}))
    })
}
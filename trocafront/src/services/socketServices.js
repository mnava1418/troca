import { MINTING_STATUS } from "../config"
import MyPortfolio from "../models/MyPortfolio"
import { setAlert, updateChatUsers } from "../store/slices/statusSlice"
import { INFURA_URL } from "../config"
import { updateTokenPrice } from "../store/slices/portfolioSlice"
import { showExchange } from "../store/slices/exchangeSlice"

export const setMintingListeners = (dispatch, account, socket, actions = {}, contracts = {}) => {
    socket.on('update-tokens-available', (info) => {
        actions.showMintingStatus('', info.totalCount, info.availableTokens, info.newToken)
    })

    socket.on('minting-token', (newToken, mintingAccount) => {
        if(newToken !== undefined && newToken !== null) {
            if(mintingAccount === account) {
                const portfolio = new MyPortfolio(dispatch)
                
                portfolio.mint(account, contracts.nft, contracts.troca, newToken)
                .then(() => {
                    socket.emit('complete-minting', newToken.uri)
                    actions.displayNFT(`${INFURA_URL}/${newToken.image}`)
                })
                .catch( errorMessage => {
                    dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
                    socket.emit('cancel-minting', newToken.uri)
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
        const isOnline = localStorage.getItem('isOnline')

        if(isOnline == 'true' && showOrder == 'false') {
            dispatch(showExchange({show: true, order}))
        }
    })
}
import { MINTING_STATUS } from "../config"

export const setListeners = (account, socket, actions = {}) => {
    socket.on('update-tokens-available', (info) => {
        actions.showMintingStatus('', info.totalCount, info.availableTokens)
    })

    socket.on('minting-token', (newToken, mintingAccount) => {
        if(newToken !== undefined && newToken !== null) {
            if(mintingAccount === account) {
                console.log('vamos a mintear', newToken)
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
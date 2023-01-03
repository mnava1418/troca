import { setAlert } from '../store/slices/statusSlice'

export const isMetamaskAvailable = () => {
    const { ethereum } = window

    if(ethereum && ethereum.isMetaMask) {
        return true
    } else {
        return false
    }
}

export const connectWallet = async (dispatch) => {
    const errorTitle = 'Error connecting your wallet'

    if(!isMetamaskAvailable()) {
        dispatch(setAlert({show: true, type: 'danger', title: errorTitle, text: 'MetaMask is not available.'}))
        return undefined
    }

    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    .catch(error => {
        console.error(error)
        dispatch(setAlert({show: true, type: 'danger', title: errorTitle, text: error.message}))
        return []
    })
    
    if(accounts.length > 0) {
        return accounts[0]
    } else {
        return undefined
    }
}
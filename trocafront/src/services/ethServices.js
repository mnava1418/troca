import Web3 from 'web3/dist/web3.min'
import { setAlert } from '../store/slices/statusSlice'
import { SIGN_MESSAGE } from '../config'

const getWeb3Provider = () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    return web3
}

export const isMetamaskAvailable = () => {
    const { ethereum } = window

    if(ethereum && ethereum.isMetaMask) {
        return true
    } else {
        return false
    }
}

export const connectWallet = async (dispatch) => {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    .catch(error => {
        console.error(error)
        dispatch(setAlert({show: true, type: 'danger', title: 'MetaMask Error', text: error.message}))
        return []
    })
    
    if(accounts && accounts.length > 0) {
        return accounts[0]
    } else {
        return undefined
    }
}

export const signMessage = async(account, dispatch) => {
    const web3 = getWeb3Provider()
    const result = await web3.eth.personal.sign(SIGN_MESSAGE, account)
    .then(signature => {
        return {isValid: true, signature}
    })
    .catch(error => {
        console.error(error)
        dispatch(setAlert({show: true, type: 'danger', title: 'MetaMask Error', text: error.message}))
        return {isValid: false}
    })

    return result
}


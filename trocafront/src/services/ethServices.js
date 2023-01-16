import Web3 from 'web3/dist/web3.min'
import { setAlert } from '../store/slices/statusSlice'
import { loadContractData } from '../store/slices/contractsSlice'
import { SIGN_MESSAGE } from '../config'

import NFTContract from '../abis/NFT.json'
import TrocaContract from '../abis/Troca.json'

const SMART_CONTRACTS = {
    nft: NFTContract,
    troca: TrocaContract
}

const getWeb3Provider = () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    return web3
}

const loadContractDefinition = async (web3, contractDef) => {
    const networkId = await web3.eth.net.getId()
    const networks = contractDef.networks

    if(networks[networkId] === undefined) {        
        return undefined
    } else {
        const address = networks[networkId].address
        const abi = contractDef.abi
        const contract = new web3.eth.Contract(abi, address)        
        return contract
    }
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
        const currentAccount = await getConnectedAccount()
        return currentAccount
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

export const getConnectedAccount = async (web3 = undefined) => {
    if(web3 === undefined) {
        web3 = getWeb3Provider()
    }
    
    const accounts = await web3.eth.getAccounts()
    .catch(error => {
        console.error(error)
        return []
    })

    if(accounts && accounts.length > 0) {
        return accounts[0]
    } else {
        return undefined
    }
}

export const accountListener = (account, user) => {
    const web3 = getWeb3Provider()

    const interval = setInterval( async () => {
        const connectedAccount = await getConnectedAccount(web3)

        if(account !== connectedAccount ) {
            user.disconnect()
            clearInterval(interval)

            if(connectedAccount !== undefined) {
                user.login()
            }
        }
    }, 1000)
}

export const loadContracts = async(dispatch) => {
    const web3 = getWeb3Provider()
    let contractsLoaded = {}

    for(const contractName in SMART_CONTRACTS) {
        const contract = await loadContractDefinition(web3, SMART_CONTRACTS[contractName])

        if(contract) {
            contractsLoaded[contractName] = contract

        } else {
            contractsLoaded = {}
            break
        }
    }

    if(Object.keys(contractsLoaded).length === 0) {
        dispatch(setAlert({show: true, type: 'danger', title: 'Error loading contracts.', text: "Select another network."}))
    } else {
        dispatch(loadContractData({web3, contracts: contractsLoaded}))
    }
}

export const parseAccount = (account) => {
    if(account === undefined || account.length < 5) {
        return ''
    } else {
        return `${account.substring(0,5)}...${account.substring(account.length - 4)}`
    }
}
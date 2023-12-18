import Web3 from 'web3/dist/web3.min'
import { setAlert, setStyleAnimation } from '../store/slices/statusSlice'
import { loadContractData } from '../store/slices/contractsSlice'
import { transferToken, listToken } from '../store/slices/portfolioSlice'
import { switchTokens } from '../store/slices/exchangeSlice'
import { SIGN_MESSAGE } from '../config'
import { get } from './networkService'

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

const getETHPrice = async () => {
    const result = await get('https://api.coinbase.com', '/v2/prices/ETH-USD/spot')
    let ethPrice = 0.0

    if(result.status === 200) {
        ethPrice =  parseFloat(result.data.data.amount)
    }
    
    return ethPrice
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
        dispatch(setAlert({show: true, type: 'danger', text: error.message}))
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
        dispatch(setAlert({show: true, type: 'danger', text: error.message}))
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
    const networkId = await web3.eth.net.getId()
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
        dispatch(setAlert({show: true, type: 'danger', text: "Smart Contracts not available. Select another network."}))
    } else {
        dispatch(loadContractData({web3, contracts: contractsLoaded, networkId}))
    }

    return contractsLoaded
}

export const parseAccount = (account) => {
    if(account === undefined || account.length < 5) {
        return ''
    } else {
        return `${account.substring(0,5)}...${account.substring(account.length - 4)}`
    }
}

export const parseUsername = (userName) => {
    if(userName.length < 10) {
        return userName
    } else {
        return `${userName.substring(0,10)}...`
    }
}

export const parseError = (error) => {
    if(error.code === 4001) {
        return error.message
    } else {
        error = error.message.split('___')

        if(error.length > 1) {
            return error[1]
        } else {
            return 'Unexpected error. Try again later.'
        }
    }
}

export const usdToEth = async(usdAmount) => {
    const ethPrice = await getETHPrice()
    return (usdAmount / ethPrice)
}

export const subscribeTrocaEvents = (troca, nft, account, dispatch, socket) => {    
    troca.events.BuyToken()
    .on('data', (event) => {
        dispatch(transferToken({id: parseInt(event.returnValues.tokenId), newOwner: event.returnValues.buyer}))

        if(event.returnValues.buyer === account) {
            dispatch(setAlert({show: true, type: 'success', text: 'Congratulations! Your new NFT is ready. Go to your portfolio to start playing with it.'}))            
            socket.emit('token-sold', event.returnValues.tokenId, event.returnValues.seller)
        } else if(event.returnValues.seller === account) {
            dispatch(setAlert({show: true, type: 'success', text: `Congratulations! You just sold NFT #${event.returnValues.tokenId}`}))
        }         
    })

    nft.events.Approval()
    .on('data', (event) => {                
        dispatch(listToken({id: parseInt(event.returnValues.tokenId.toString())}))
    })    

    troca.events.SwitchToken()
    .on('data', (event) => {
        dispatch(transferToken({id: parseInt(event.returnValues.buyerTokenId), newOwner: event.returnValues.seller}))
        dispatch(transferToken({id: parseInt(event.returnValues.sellerTokenId), newOwner: event.returnValues.buyer}))

        if(event.returnValues.buyer === account || event.returnValues.seller === account) {
            dispatch(setAlert({show: true, type: 'success', text: 'Congratulations! You have exchanged a token. Go to your order book to find more details.'}))
            dispatch(setStyleAnimation('exchange-item-animation'))

            setTimeout(() => {
                dispatch(switchTokens())
            }, 500)
        }
    })
}
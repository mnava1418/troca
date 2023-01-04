const Web3 = require('web3')
const authWeb3 = require('../config/auth').web3

const getProvider = () => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545") //TO-DO: Set production provider URL
    return provider
}

const login = async (account, signature) => {
    const web3 = new Web3(getProvider())
    let originalAccount = ''

    try {
        originalAccount = await web3.eth.accounts.recover(authWeb3.message, signature)
    } catch (error) {
        console.error(error)
    }

    if(originalAccount.toLowerCase() === account.toLowerCase()) {
        return true
    } else {
        return false
    }
}

module.exports = {
    login
}

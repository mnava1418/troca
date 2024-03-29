const Web3 = require('web3')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const userService = require('./userService')

const generateToken = (payload) => {
    const token = jwt.sign(payload, authConfig.jwt.password, {expiresIn: authConfig.jwt.expires})
    return token
}

const validateToken = (token) => {
    let result = undefined

    jwt.verify(token, authConfig.jwt.password, (err, decoded ) => {
        if(err) {
            console.error(err)
        } else {
            result = decoded
        }
    })

    return result
}

const getProvider = (networkId) => {
    const providerURL = authConfig.web3.provider[networkId]
    const provider = new Web3.providers.HttpProvider(providerURL)

    return provider
}

const login = async (account, signature, networkId) => {
    const web3 = new Web3(getProvider(networkId))
    let originalAccount = ''

    try {
        originalAccount = await web3.eth.accounts.recover(authConfig.web3.message, signature)
    } catch (error) {
        console.error(error)
    }
    
    if(originalAccount !== '' && originalAccount.toLowerCase() === account.toLowerCase()) {
        const token = generateToken({account: originalAccount})    
        let userInfo = await userService.getUserInfo(originalAccount)

        if(!userInfo) {            
            await userService.updateUserInfo(account)
        }

        return {isValid: true, token}
    } else {
        return {isValid: false, error: 'Unable to authenticate account.'}
    }
}

module.exports = {
    login,
    validateToken
}

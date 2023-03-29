const portfolioService = require('./portfolioService')
const ethService = require('./ethService')
const userService = require('./userService')
const config = require('../config')

const generateToken = async (account) => {    
    const availableTokens = await portfolioService.getAvailableTokens()

    if(availableTokens.available.length > 0) {
        const index = availableTokens.available.length == 1 ? 0 : Math.floor(Math.random() * availableTokens.available.length)
        const newToken = availableTokens.available[index]
        const result = await ethService.updateMetaData(newToken.uri, {status: config.tokenStatus.minting})

        if(result) {
            await userService.updateUserInfo(account, {isMinting: true, token: newToken.uri})
            return newToken
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

const userIsMinting = async (account) => {
    const userInfo = await userService.getUserInfo(account)

    if(userInfo && userInfo.isMinting) {
        return {isMinting: true, token: userInfo.token}
    } else {
        return {isMinting: false}
    }
}

const cancelMinting = async(account, token) => {
    await ethService.updateMetaData(token, {status: config.tokenStatus.available})
    await userService.updateUserInfo(account, {isMinting: null, token: null})
}

const completeMinting = async(account, token) => {
    await ethService.updateMetaData(token, {status: config.tokenStatus.minted})
    await userService.updateUserInfo(account, {isMinting: null, token: null})
}

const updatePrice = async(uri, price) => {
    await ethService.updateMetaData(uri, {price})
}

module.exports = {
    generateToken,
    userIsMinting,
    cancelMinting,
    completeMinting,
    updatePrice,
}

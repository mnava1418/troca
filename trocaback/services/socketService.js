const ethService = require('./ethService')
const userService = require('./userService')
const config = require('../config')

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

const updatePrice = async(uri, price) => {
    await ethService.updateMetaData(uri, {price})
}

module.exports = {
    userIsMinting,
    cancelMinting,    
    updatePrice,
}

const userService = require('./userService')
const ethService = require('./ethService')

const userIsMinting = async (account) => {
    const userInfo = await userService.getUserInfo(account)

    if(userInfo && userInfo.isMinting) {
        return {isMinting: true, token: userInfo.token}
    } else {
        return {isMinting: false}
    }
}

const mintToken = async (account, tokenInfo) => {
    const { title, description, price } = tokenInfo    

    const tokenImage = await ethService.generateTokenImage(description)

    if(tokenImage) {
        const token = await ethService.saveNFTMetaData(title, description, price, tokenImage)
        await userService.updateUserInfo(account, {isMinting: true, token})

        if(token) return token
    }    

    return undefined    
}

const completeMinting = async(account, token) => {
    const { title, description, image, price } = token   
    await userService.updateUserInfo(account, {isMinting: null, token: null})
    await ethService.updateMetaData(token.uri, {title, description, image, price})
}

const cancelMinting = async(account, token) => {
    await userService.updateUserInfo(account, {isMinting: null, token: null})
    await ethService.unPinToken(token)
}

module.exports = {
    mintToken,
    completeMinting,
    cancelMinting,
    userIsMinting
}
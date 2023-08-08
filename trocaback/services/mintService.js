const userService = require('./userService')
const ethService = require('./ethService')

const mintToken = async (account, tokenInfo) => {
    const { title, description, price } = tokenInfo
    await userService.updateUserInfo(account, {isMinting: true})

    const tokenImage = await ethService.generateTokenImage(description)

    if(tokenImage) {
        const token = await ethService.saveNFTMetaData(title, description, price, tokenImage)

        if(token) return token
    }    

    return undefined    
}

const completeMinting = async(account, token) => {
    const { title, description, image, price } = token   
    await userService.updateUserInfo(account, {isMinting: null})
    await ethService.updateMetaData(token.uri, {title, description, image, price})
}

const cancelMinting = async(account, token) => {
    await userService.updateUserInfo(account, {isMinting: null})
    await ethService.unPinToken(token)
}

module.exports = {
    mintToken,
    completeMinting,
    cancelMinting
}
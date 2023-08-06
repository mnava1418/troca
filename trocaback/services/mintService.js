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

module.exports = {
    mintToken
}
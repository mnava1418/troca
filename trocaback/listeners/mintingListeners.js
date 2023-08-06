const portfolioService = require('../services/portfolioService')
const socketService = require('../services/socketService')
const mintService = require('../services/mintService')
const userService = require('../services/userService')

module.exports = (io, socket) => {
    socket.on('tokens-available', async () => {
        const availableTokens = await portfolioService.getAvailableTokens()
        socket.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
    })

    socket.on('generate-token', async(tokenInfo) => {
        console.info(`${socket.account} is generating a new token`)
        const newToken = await mintService.mintToken(socket.account, tokenInfo)
        io.emit('minting-token', newToken, socket.account)
    })

    socket.on('cancel-minting', async (tokenURI) => {
        await socketService.cancelMinting(socket.account, tokenURI)
        const availableTokens = await portfolioService.getAvailableTokens()
        io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
    })

    socket.on('complete-minting', async () => {
        console.info(`${socket.account} minted a new token`)
        await userService.updateUserInfo(socket.account, {isMinting: null})        
    })
}
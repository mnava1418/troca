const portfolioService = require('../services/portfolioService')
const socketService = require('../services/socketService')

const mintingListeners = (io, socket) => {
    socket.on('tokens-available', async () => {
        const availableTokens = await portfolioService.getAvailableTokens()
        socket.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
    })

    socket.on('generate-token', async() => {
        console.info(`${socket.account} is generating a new token`)
        const newToken = await socketService.generateToken(socket.account)            
        io.emit('minting-token', newToken, socket.account)
    })

    socket.on('cancel-minting', async (tokenURI) => {
        await socketService.cancelMinting(socket.account, tokenURI)
        const availableTokens = await portfolioService.getAvailableTokens()
        io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
    })

    socket.on('complete-minting', async (tokenURI) => {
        console.info(`${socket.account} minted a new token`)
        await socketService.completeMinting(socket.account, tokenURI)
        const availableTokens = await portfolioService.getAvailableTokens()
        io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})
    })
}

const setListeners = (io, socket) => {
    socket.on('disconnect', async () => {            
        console.info(`Client disconnected: ${socket.account}`)

        //Check if user was minting
        const userIsMinting = await socketService.userIsMinting(socket.account)
        if(userIsMinting.isMinting) {
            await socketService.cancelMinting(socket.account, userIsMinting.token)
            const availableTokens = await portfolioService.getAvailableTokens()
            io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
        } 
    })

    mintingListeners(io, socket) //set minting listeners
}

module.exports = {
    setListeners
}
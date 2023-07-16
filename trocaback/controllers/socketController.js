const portfolioService = require('../services/portfolioService')
const socketService = require('../services/socketService')
const userService = require('../services/userService')
const mintingListeners = require('../listeners/mintingListeners')
const portfolioListeners = require('../listeners/portfolioListeners')
const chatListeners = require('../listeners/chatListeners')
const exchangeListeners = require('../listeners/exchangeListeners')

const setListeners = (io, socket, webPush) => {
    socket.on('disconnect', async () => {            
        //Check if user was minting
        const userIsMinting = await socketService.userIsMinting(socket.account)
        if(userIsMinting.isMinting) {
            await socketService.cancelMinting(socket.account, userIsMinting.token)
            const availableTokens = await portfolioService.getAvailableTokens()
            io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
        }
        
        const chatUsers = userService.connectUserToChat(socket.account, false)
        io.emit('update-chat-users', chatUsers);
    })

    mintingListeners(io, socket) //set minting listeners
    portfolioListeners(io, socket) //set portfolio listeners
    chatListeners(io, socket) //set chat listeners
    exchangeListeners(io, socket, webPush) //set exchange listeners
}

module.exports = {
    setListeners
}
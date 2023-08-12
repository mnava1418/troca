const userService = require('../services/userService')
const mintingListeners = require('../listeners/mintingListeners')
const portfolioListeners = require('../listeners/portfolioListeners')
const chatListeners = require('../listeners/chatListeners')
const exchangeListeners = require('../listeners/exchangeListeners')
const mintService = require('../services/mintService')

const setListeners = (io, socket, webPush) => {
    socket.on('disconnect', async () => {            
        //Check if user was minting
        const userIsMinting = await mintService.userIsMinting(socket.account)
        if(userIsMinting.isMinting) {
            await mintService.cancelMinting(socket.account, userIsMinting.token)
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
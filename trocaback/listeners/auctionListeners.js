const auctionService = require('../services/auctionService')

module.exports = (io, socket, webPush) => {
    socket.on('create-auction', async (token) => {
        const auction = await auctionService.creatAuction(socket.account, token)
        socket.emit('auction-created', auction)
    })
}
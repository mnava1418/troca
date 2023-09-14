const auctionService = require('../services/auctionService')
const notificationService = require('../services/notificationService')

module.exports = (io, socket, webPush) => {
    socket.on('create-auction', async (token) => {
        const auction = await auctionService.creatAuction(socket.account, token)        
        
        if(auction.result) {
            const newAuctionDesktopPayload = notificationService.generateNewAuctionNotification(auction.auctionId)
            notificationService.notifyAll(socket.account, newAuctionDesktopPayload, webPush)
        }

        socket.emit('auction-created', auction)
    })
}
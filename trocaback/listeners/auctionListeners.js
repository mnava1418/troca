const auctionService = require('../services/auctionService')
const notificationService = require('../services/notificationService')

module.exports = (io, socket, webPush) => {
    socket.on('create-auction', async (token) => {
        const auction = await auctionService.creatAuction(socket.account, token)        
        
        if(auction.result) {
            const newAuctionDesktopPayload = notificationService.generateNewAuctionNotification(auction.auctionId)
            notificationService.notifyAll(socket.account, newAuctionDesktopPayload, webPush)
            socket.broadcast.emit('auction-update-list', auction);
        }

        socket.emit('auction-created', auction)
    })

    socket.on('join-auction', async(auctionId, users) => {
        const userAuction = await auctionService.userInAuction(socket.account)        

        if(!userAuction.isInAuction) {
            users += 1
            const joinResult = await auctionService.joinAuction(socket.account, parseInt(auctionId), {users})

            if(joinResult) {
                socket.join(auctionId.toString())
                io.emit('auction-joined', auctionId)
                io.to(auctionId.toString()).emit('auction-message', auctionId, `User ${socket.account} has joined the auction.`)
                socket.emit('auction-user-update', auctionId)
            }
        } else {
            socket.emit('auction-message', auctionId, 'You already have an auction in progress.')
        }        
    })

    socket.on('join-auction-room', async(auctionId) => {
        socket.join(auctionId.toString())        
    })
}
const auctionService = require('../services/auctionService')
const notificationService = require('../services/notificationService')
const ethService = require('../services/ethService')
const { auctionStatus } = require('../config')

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
        const messageId = Date.now()
        const message = {id: messageId, user: socket.account, text: undefined}

        if(!userAuction.isInAuction) {
            users += 1
            const joinResult = await auctionService.joinAuction(socket.account, parseInt(auctionId), {users})

            if(joinResult) {
                socket.join(auctionId.toString())
                io.emit('auction-joined', auctionId)

                message.text = `User ${ethService.parseAccount(socket.account)} has joined the auction.`
                auctionService.saveMessage(auctionId, message)
                
                io.to(auctionId.toString()).emit('auction-message', auctionId, message)
                socket.emit('auction-user-update', auctionId)
            }
        } else {
            message.text = 'You already have an auction in progress.'
            socket.emit('auction-message', auctionId, message)
        }   
        
    })

    socket.on('join-auction-room', async(auctionId) => {
        socket.join(auctionId.toString())        
    })

    socket.on('start-auction', async(auctionId, price) => {
        
        const result = await auctionService.updateAuction(auctionId, {status: auctionStatus.live})

        if(result) {
            const messageId = Date.now()
            const message = {id: messageId, user: socket.account, text: `Auction started. Initial price ${price} ETH.`}
            auctionService.saveMessage(auctionId, message)
            
            io.to(auctionId.toString()).emit('auction-message', auctionId, message)
            io.emit('auction-started', auctionId)
        }
    })
}
const auctionService = require('../services/auctionService')
const notificationService = require('../services/notificationService')
const ethService = require('../services/ethService')
const { auctionStatus } = require('../config')

module.exports = (io, socket, webPush) => {
    socket.on('create-auction', async (token) => {
        const auction = await auctionService.creatAuction(socket.account, token)        
        
        if(auction.result) {
            auctionService.markToken(token.key, true)
            const newAuctionDesktopPayload = notificationService.generateNewAuctionNotification(auction.auctionId)
            notificationService.notifyAll(socket.account, newAuctionDesktopPayload, webPush)
            socket.broadcast.emit('auction-update-list', auction);
            io.emit('token-inAuction', token.id, true)
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
                
                io.emit('auction-message', auctionId, message)
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

    socket.on('price-update-auction', async(auctionId, newPrice) => {
        const currentAuction = await auctionService.getLiveAuctions(socket.account)
        .then(result => {
            return result.liveAuctions[auctionId]
        })

        const messageId = Date.now()
        const message = {id: messageId, user: socket.account, text: ''}
        
        if(currentAuction && parseFloat(newPrice) >= parseFloat(currentAuction.price)) {
            auctionService.updatePrice(auctionId, newPrice, socket.account, io)
            .then(result => {
                if(result) {
                    message.text = `User ${ethService.parseAccount(socket.account)} updated auction price. Current price ${newPrice} ETH.`
                    auctionService.saveMessage(auctionId, message)
                    io.to(auctionId.toString()).emit('auction-message', auctionId, message)
                    io.to(auctionId.toString()).emit('auction-price-updated', auctionId, newPrice)
                } else {
                    message.text = `Unable to update auction price.`
                    socket.emit('auction-message', auctionId, message)
                }
            })
        } else {
            message.text = 'Invalid price.'
            socket.emit('auction-message', auctionId, message)
        }
    })

    socket.on('reject-auction', async(auction) => {
        const {id: auctionId, token} = auction
        const currentAuction = await auctionService.getCurrentAuction(auctionId)
        const priceHistory = currentAuction.priceHistory
        const newPriceHistory = {}
        let previousPrice = 0        

        Object.keys(priceHistory).sort().forEach(id => {
            if(priceHistory[id].account !== socket.account) {
                newPriceHistory[id] = priceHistory[id]

                if(id > previousPrice) {
                    previousPrice = id
                }
            }            
        })

        const messageId = Date.now()
        const message = {id: messageId, user: socket.account, text: ''}
        
        const currentUsers = currentAuction.users - 1        
        let restartAuction = true
        let newPrice = undefined
        let newAccount = undefined
        let currentStatus = auctionStatus.live

        const toExecute = [auctionService.leaveAuction(socket.account)]
        const auctionInfo = {priceHistory: newPriceHistory, status: currentStatus, users: currentUsers}

        if(currentUsers > 0 && previousPrice > 0) {
            message.text = `User ${ethService.parseAccount(socket.account)} canceled the transaction and has been removed from the auction. Previous price was ${newPriceHistory[previousPrice].price} from ${ethService.parseAccount(newPriceHistory[previousPrice].account)}. Restarting auction...`
            auctionInfo.price = newPriceHistory[previousPrice].price
            newPrice = newPriceHistory[previousPrice].price
            newAccount = newPriceHistory[previousPrice].account
        } else {
            message.text = `User ${ethService.parseAccount(socket.account)} canceled the transaction and has been removed from the auction. No more live prices so auction is terminated.`   
            currentStatus = auctionStatus.end 
            auctionInfo.status = currentStatus
            auctionInfo.price = null
            toExecute.push(auctionService.leaveAuction(currentAuction.account))
            toExecute.push(auctionService.markToken(token.key, null))
            restartAuction = false
            io.emit('token-inAuction', token.id, false)
        }
        
        toExecute.push(auctionService.updateAuction(auctionId, auctionInfo))

        await Promise.all(toExecute)
            
        auctionService.saveMessage(auctionId, message)
        io.to(auctionId.toString()).emit('auction-message', auctionId, message)    
        io.to(auctionId.toString()).emit('auction-rejected', auctionId, currentStatus, socket.account, newAccount, newPrice, restartAuction)        
    })

    socket.on('complete-auction', (auction) => {
        const {id: auctionId, token} = auction
        auctionService.completeAuction(auctionId)
        auctionService.markToken(token.key, null)
        io.emit('token-inAuction', token.id, false)

        const messageId = Date.now()
        const message = {id: messageId, user: socket.account, text: 'Auction completed. Thanks for participating, keep swaping!'}
        auctionService.saveMessage(auctionId, message)
        io.to(auctionId.toString()).emit('auction-message', auctionId, message)    
        io.to(auctionId.toString()).emit('auction-completed', auctionId, auctionStatus.complete)
    })
}
const exchangeService = require('../services/exchangeService')
const notificationService = require('../services/notificationService')

module.exports = (io, socket, webPush) => {
    socket.on('update-bid', (order, to) => {
        console.info('order', order)
        order = exchangeService.updateBid(order, to, webPush)
        socket.emit('refresh-order', order)
        io.to(to).emit('review-bid', order);
    })

    socket.on('token-sold', (token, to) => {        
        notificationService.sendNotification(to, undefined, webPush, token)
    })
}
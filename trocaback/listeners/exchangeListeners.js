const exchangeService = require('../services/exchangeService')

module.exports = (io, socket, webPush) => {
    socket.on('update-bid', (order, to) => {
        console.info('order', order)
        exchangeService.updateBid(order, to, webPush)
        socket.emit('refresh-order', order)
        io.to(to).emit('review-bid', order);
    })
}
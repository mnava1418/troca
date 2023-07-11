const exchangeService = require('../services/exchangeService')

module.exports = (io, socket) => {
    socket.on('update-bid', (order, to) => {
        console.info('order', order)
        exchangeService.updateBid(order)
        socket.emit('refresh-order', order)
        io.to(to).emit('review-bid', order);
    })
}
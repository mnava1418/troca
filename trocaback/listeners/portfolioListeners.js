const socketService = require('../services/socketService')

module.exports = (io, socket) => {
    socket.on('update-token-price', async (uri, id, owner, price) => {
        if(socket.account === owner) {
            await socketService.updatePrice(uri, price)
            io.emit('refresh-token', id, price)
        }
    })
}
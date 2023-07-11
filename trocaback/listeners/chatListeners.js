const userService = require('../services/userService')

module.exports = (io, socket) => {
    socket.on('connect-to-chat', (user, isOnline) => {
        const chatUsers = userService.connectUserToChat(user, isOnline)
        io.emit('update-chat-users', chatUsers);
    })
}
const userService = require('../services/userService')

module.exports = (io, socket) => {
    socket.on('connect-to-chat', async (user, isOnline) => {
        const chatUsers = await userService.connectUserToChat(user, isOnline)
        io.emit('update-chat-users', chatUsers);
    })
}
const { Server } = require('socket.io')
const webpush = require('web-push')
const authConfig = require('../config/auth')
const authService = require('../services/authService')
const socketController = require('../controllers/socketController')

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: authConfig.origin[process.env.NODE_ENV]
        }
    })

    io.use((socket, next) => {        
        if (socket.handshake.query && socket.handshake.query.token){
            const result = authService.validateToken(socket.handshake.query.token)
            if(result !== undefined) {
                socket.account = result.account
                next()
            } else {
                socket.disconnect()
                next(new Error('Authentication error'));
            }

        } else {
            socket.disconnect()
            next(new Error('Authentication error'));
        }        
    })

    io.on('connection', (socket) => {    
        socket.join(socket.account)
        webpush.setVapidDetails(authConfig.webPush.contact, authConfig.webPush.publicKey, authConfig.webPush.privateKey)
        socketController.setListeners(io, socket, webpush)
    })    

    console.info('Socket-io ready!')
}

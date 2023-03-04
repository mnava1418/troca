const { Server } = require('socket.io')
const authConfig = require('../config/auth')
const authService = require('../services/authService')

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
                next()
            } else {
                next(new Error('Authentication error'));
            }

        } else {
            next(new Error('Authentication error'));
        }        
    })

    io.on('connection', (socket) => {
        console.info(`Client connected: ${socket.id}`)

        socket.on('disconnect', () => {
            console.info(`Client disconnected: ${socket.id}`)
        })
    })

    console.info('Socket-io ready!')
}

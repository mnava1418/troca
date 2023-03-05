const { Server } = require('socket.io')
const authConfig = require('../config/auth')
const authService = require('../services/authService')
const portfolioService = require('../services/portfolioService')
const socketService = require('../services/socketService')

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
        console.info(`Client connected: ${socket.account}`)
        
        socket.on('disconnect', async () => {            
            console.info(`Client disconnected: ${socket.account}`)

            //Check if user was minting
            const userIsMinting = await socketService.userIsMinting(socket.account)
            if(userIsMinting.isMinting) {
                await socketService.cancelMinting(socket.account, userIsMinting.token)
                const availableTokens = await portfolioService.getAvailableTokens()
                io.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
            } 
        })

        socket.on('tokens-available', async () => {
            const availableTokens = await portfolioService.getAvailableTokens()
            socket.emit('update-tokens-available', {totalCount: availableTokens.totalCount, availableTokens: availableTokens.available.length})            
        })

        socket.on('generate-token', async() => {
            console.info(`${socket.account} is generating a new token`)
            const newToken = await socketService.generateToken(socket.account)            
            io.emit('minting-token', newToken, socket.account)
        })
    })    

    console.info('Socket-io ready!')
}

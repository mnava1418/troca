const mintService = require('../services/mintService')

module.exports = (io, socket) => {
    socket.on('generate-token', async(tokenInfo) => {
        console.info(`${socket.account} is generating a new token`)
        const newToken = await mintService.mintToken(socket.account, tokenInfo)
        io.emit('minting-token', newToken, socket.account)
    })

    socket.on('cancel-minting', async (token) => {
        console.info(`${socket.account} did not mint the token ${token.uri}`)
        await mintService.cancelMinting(socket.account, token)        
    })

    socket.on('complete-minting', async (token) => {
        console.info(`${socket.account} minted a new token`)
        await mintService.completeMinting(socket.account, token)
    })
}
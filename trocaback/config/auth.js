const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    web3: {
        message: 'Please sign this message to validate you are the owner of the wallet. This request will not generate any cost or gas fees. Your authentication status will reset after 24 hours.'
    },

    jwt: {
        password: process.env.JWT_PASSWORD,
        expires: '24h'
    },

    origin: {
        development: 'http://localhost:3000'
    }
}

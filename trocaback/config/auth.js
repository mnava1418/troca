const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    web3: {
        message: 'Please sign this message to validate you are the owner of the wallet. This request will not generate any cost or gas fees. Your authentication status will reset after 24 hours.',
        provider: {
            development: 'http://127.0.0.1:8545',
            production: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        }        
    },

    jwt: {
        password: process.env.JWT_PASSWORD,
        expires: '24h'
    },

    origin: {
        development: 'http://localhost:3000',
        production: 'https://trocaa.netlify.app'
    },

    firebase: {
        credential: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        dbURL: process.env.FIREBASE_DB_URL
    },

    infura: {
        projectId: process.env.INFURA_PROJECT_ID,
        secret: process.env.INFURA_PROJECT_SECRET
    },

    webPush: {
        publicKey: process.env.PUBLIC_VAPID_KEY,
        privateKey: process.env.PRIVATE_VAPID_KEY,
        contact: 'mailto:mnavapena@gmail.com'
    },

    huggingFace: {
        token: process.env.HUGGING_FACE_TOKEN
    }
}

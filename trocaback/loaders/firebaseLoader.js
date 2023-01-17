const admin = require('firebase-admin')
const auth = require('../config/auth').firebase

module.exports = () => {
    admin.initializeApp({
        credential : admin.credential.cert(auth.credential),
        databaseURL: auth.dbURL
    })

    console.info('Firebase ready!')
}

const express = require('express')
const authController = require('../controllers/authController')
const notificationController = require('../controllers/notificationController')

const router = express.Router()

module.exports = () => {    
    router.post('/subscribe', authController.validateToken, notificationController.subscribeUser)
    return router
}

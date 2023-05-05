const express = require('express')
const authController = require('../controllers/authController')
const exchangeController = require('../controllers/exchangeController')

const router = express.Router()

module.exports = () => {    
    router.get('/orderBook', authController.validateToken, exchangeController.getOrderBook)    
    return router
}

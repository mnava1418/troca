const express = require('express')
const authController = require('../controllers/authController')
const auctionController = require('../controllers/auctionController')

const router = express.Router()

module.exports = () => {    
    router.get('/', authController.validateToken, auctionController.getLiveAuctions)
    return router
}

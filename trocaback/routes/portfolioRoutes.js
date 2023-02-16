const express = require('express')
const authController = require('../controllers/authController')
const portfolioController = require('../controllers/portfolioController')

const router = express.Router()

module.exports = () => {    
    router.get('/', authController.validateToken, portfolioController.getAllTokens)
    return router
}

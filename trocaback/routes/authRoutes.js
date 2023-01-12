const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

module.exports = () => {    
    router.post('/login', authController.login)
    router.post('/validate', authController.validateToken, authController.validateAccount)
    return router
}
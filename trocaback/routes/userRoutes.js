const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

module.exports = () => {    
    router.get('/', authController.validateToken, userController.getUserInfo)
    router.post('/', authController.validateToken, userController.updateUserInfo)
    return router
}
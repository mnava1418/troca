const express = require('express')
const multer = require('multer')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()
const upload = multer()

module.exports = () => {    
    router.get('/', authController.validateToken, userController.getUserInfo)    
    router.post('/', authController.validateToken, upload.single('imgData'), userController.updateUserInfo)
    router.get('/all', authController.validateToken, userController.getAllUsers)    
    return router
}

const express = require('express')
const multer = require('multer')
const authController = require('../controllers/authController')
const ethController = require('../controllers/ethController')

const router = express.Router()
const upload = multer()

module.exports = () => {    
    router.post('/metaData', authController.validateToken, upload.single('imgData'), ethController.saveNFTMetaData)
    return router
}

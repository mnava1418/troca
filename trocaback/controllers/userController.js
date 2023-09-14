const userService = require('../services/userService')
const ethService = require('../services/ethService')

const getUserInfo = async (req, res) => {
    const account = req.originalAccount
    const userInfo = await userService.getUserInfo(account)

    if(userInfo) {
        res.status(200).json({userInfo})
    } else {
        res.status(500).json({error: 'Unable to get user information.'})
    }
}

const updateUserInfo = async (req, res) => {
    const account = req.originalAccount
    let {username, email, img} = req.body
    const imgData = req.file

    const validationResult = await userService.validateUserInfo(account.trim(), email.trim(), username.trim())

    if(validationResult.success) {
        if(imgData) {
            img = await ethService.ipfsUploadImg(imgData.buffer)
        }

        const userInfo = {username: username.trim(), email: email.trim(), img: img.trim()}
        const result = await userService.updateUserInfo(account, userInfo)

        if(result) {
            res.status(200).json({message: 'Ok', userInfo})
        } else {
            res.status(500).json({error: 'Unable to update user information.'})
        }
    } else {
        res.status(500).json({error: validationResult.error})
    }
}

const getAllUsers = async(req, res) => {
    const users = await userService.getAllUsers()
    res.status(200).json({users: users.all})
}

const subscribe = async(req, res) => {
    const account = req.originalAccount
    const {activateMembership} =  req.body        

    const result = await userService.updateUserInfo(account, {isMember: activateMembership})

    if(result) {
        res.status(200).json({message: 'Ok'})
    } else {
        res.status(500).json({error: 'Unable to update user information.'})
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo,
    getAllUsers,
    subscribe
}

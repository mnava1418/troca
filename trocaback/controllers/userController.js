const userService = require('../services/userService')

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
    const {username, email, img} = req.body
    
    const validationResult = await userService.validateUserInfo(account.trim(), email.trim(), username.trim())

    if(validationResult.success) {
        const result = await userService.updateUserInfo(account, {username: username.trim(), email: email.trim(), img: img.trim()})

        if(result) {
            res.status(200).json({message: 'Ok'})
        } else {
            res.status(500).json({error: 'Unable to update user information.'})
        }
    } else {
        res.status(500).json({error: validationResult.error})
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo
}

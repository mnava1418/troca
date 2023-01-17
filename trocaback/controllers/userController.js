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

module.exports = {
    getUserInfo
}

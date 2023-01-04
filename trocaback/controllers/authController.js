const authService = require('../services/authService')

const login = async (req, res) => {
    const {account, signature} = req.body
    const result = await authService.login(account, signature)

    if(result) {
        res.status(200).json({message: 'OK'})
    } else {
        res.status(401).json({message: 'Error'})
    }
}

module.exports = {
    login
}
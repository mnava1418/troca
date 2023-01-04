const authService = require('../services/authService')

const login = async (req, res) => {
    const {account, signature} = req.body
    const result = await authService.login(account, signature)

    if(result.isValid) {
        res.status(200).json({token: result.token})
    } else {
        res.status(401).json({error: result.error})
    }
}

module.exports = {
    login
}
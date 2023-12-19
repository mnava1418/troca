const authService = require('../services/authService')

const login = async (req, res) => {
    const {account, signature, networkId} = req.body
    const result = await authService.login(account, signature, networkId)

    if(result.isValid) {
        res.status(200).json({token: result.token})
    } else {
        res.status(401).json({error: result.error})
    }
}

const validateToken = (req, res, next) => {
    const token = req.headers.authorization
    const result = authService.validateToken(token)

    if(result) {
        req.originalAccount = result.account
        next()
    } else {
        res.status(403).json({error: 'Unable to authenticate.'})
    }
}

const validateAccount = (req, res) => {
    const {account} = req.body
    const originalAccount = req.originalAccount

    if(account && originalAccount && account.toLowerCase() === originalAccount.toLowerCase()) {
        res.status(200).json({message: 'Ok'})
    } else {
        res.status(403).json({error: 'Unable to authenticate account.'})
    }
}

module.exports = {
    login,
    validateToken,
    validateAccount
}

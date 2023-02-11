const portfolioService = require('../services/portfolioService')

const getUserTokens = async (req, res) => {
    const account = req.originalAccount
    const tokens = await portfolioService.getUserTokens(account)

    if(tokens !== undefined ) {
        res.status(200).json({tokens})
    } else {
        res.status(500).json({error: 'Unable to get tokens.'})
    }
}

module.exports = {
    getUserTokens
}
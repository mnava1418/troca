const portfolioService = require('../services/portfolioService')

const getAllTokens = async (req, res) => {
    const account = req.originalAccount
    const tokens = await portfolioService.getAllTokens()

    if(tokens !== undefined ) {
        res.status(200).json({tokens})
    } else {
        res.status(500).json({error: 'Unable to get tokens.'})
    }
}

module.exports = {
    getAllTokens
}
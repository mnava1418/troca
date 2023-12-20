const portfolioService = require('../services/portfolioService')
const ethService = require('../services/ethService')

const getAllTokens = async (req, res) => {
    const tokens = await portfolioService.getAllTokens()

    if(tokens !== undefined ) {
        res.status(200).json({tokens})
    } else {
        res.status(500).json({error: 'Unable to get tokens.'})
    }
}

const unPinTokens = async (req, res) => {
    const result = await ethService.unPinList()

    if(result) {
        res.status(200).json({message: 'ok'})
    } else {
        res.status(500).json({message: 'error'})
    }
}

module.exports = {
    getAllTokens,
    unPinTokens
}
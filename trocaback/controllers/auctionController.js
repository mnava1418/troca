const auctionService = require('../services/auctionService')

const getLiveAuctions = async(req, res) => {
    const account = req.originalAccount
    const liveAuctions = await auctionService.getLiveAuctions(account)
    res.status(200).json({liveAuctions})
}

module.exports = {
    getLiveAuctions
}
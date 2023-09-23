const auctionService = require('../services/auctionService')

const getLiveAuctions = async(req, res) => {
    const account = req.originalAccount
    const result = await auctionService.getLiveAuctions(account)
    res.status(200).json({userAuction: result.userAuction, liveAuctions: result.liveAuctions})
}

module.exports = {
    getLiveAuctions
}
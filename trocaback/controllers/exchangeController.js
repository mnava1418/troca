const exchangeService = require('../services/exchangeService')

const getOrderBook = async (req, res) => {
    const account = req.originalAccount
    const orderBook = await exchangeService.getOrderBook(account)

    if(orderBook) {
        res.status(200).json({orderBook})
    } else {
        res.status(500).json({error: `Unable to get order book for account ${account}`})
    }
}

module.exports = {
    getOrderBook
}
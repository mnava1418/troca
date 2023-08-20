const admin = require('firebase-admin')
const notificationService = require('./notificationService')

const updateBid = (order, account, webPush) => {
    const query = admin.database().ref(`/orders/${order.id}`)
    query.update({...order, buyerIsNew: true, sellerIsNew: true})
    .then(() => {
        notificationService.sendNotification(account, order, webPush)
    })
    .catch(error => {
        console.error(error)
    })
}

const getOrderBook = async(account) => {
    const query = admin.database().ref('/orders')
    let orderBook = {}

    await query.once('value', (data) => {
        if(data.exists()) {
            Object.values(data.toJSON()).forEach(order => {
                if(order.buyer === account || order.seller === account) {
                    orderBook[order.id] = order
                }
            })
        }
    })
    .catch(error => {
        console.error(error)
        orderBook = undefined
    })

    return orderBook
}

module.exports = {
    updateBid,
    getOrderBook
}

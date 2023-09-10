const admin = require('firebase-admin')
const notificationService = require('./notificationService')
const bidStatus = require('../config/index').bidStatus

const updateBid = (order, to, webPush) => {    
    const buyerIsNew = order.buyer === to && order.status !== bidStatus.complete && order.status !== bidStatus.reject
    const sellerIsNew = order.seller === to && order.status !== bidStatus.complete && order.status !== bidStatus.reject
    order = {...order, buyerIsNew, sellerIsNew}

    const query = admin.database().ref(`/orders/${order.id}`)
    query.update(order)
    .then(() => {
        notificationService.sendNotification(to, order, webPush)
    })
    .catch(error => {
        console.error(error)
    })

    return order
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

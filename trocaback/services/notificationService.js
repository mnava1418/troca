const admin = require('firebase-admin')
const auth = require('../config/auth')
const config = require('../config')

const updateSuscription = (account, subscription) => {
    const query = admin.database().ref(`/notifications/${account}`)
    query.update(subscription)
    .catch(error => {
        console.error(error)
    })
}

const generateNotificaion = (order) => {
    let action = ''

    switch(order.status) {
        case config.bidStatus.accept:
            action = 'accepted'
            break
        case config.bidStatus.complete:
            action = 'completed'
            break
        case config.bidStatus.new:
            action = 'created'
            break
        case config.bidStatus.reject:
            action = 'rejected'
            break
        default:
            action = 'updated'
            break
    }

    const payload = JSON.stringify({
        title: 'Review your Order!',
        text: `Order ${order.id} has been ${action}.`,        
        url: `${auth.origin[process.env.NODE_ENV]}/orderBook`,        
    })    

    return payload
}

const sendNotification = async (account, order, webpush) => {
    const query = admin.database().ref(`/notifications/${account}`) 
    await query.once('value', (data) => {
        if(data.exists()) {
            const subscription = data.toJSON()
            const payload = generateNotificaion(order)

            webpush.sendNotification(subscription, payload)
            .catch(e => console.error(e.stack))
        }
    })
    .catch(error => {
        console.error(error)
    })
}

module.exports = {
    updateSuscription,
    sendNotification
}

const admin = require('firebase-admin')
const auth = require('../config/auth')

const updateSuscription = (account, subscription) => {
    const query = admin.database().ref(`/notifications/${account}`)
    query.update(subscription)
    .catch(error => {
        console.error(error)
    })
}

const generateNotificaion = () => {
    const payload = JSON.stringify({
        title: 'Review your Order!',
        text: 'Order 123 has been updated. Click to open the order.',        
        url: `${auth.origin[process.env.NODE_ENV]}/orderBook`,        
    })    

    return payload
}

const sendNotification = async (account, order, webpush) => {
    const query = admin.database().ref(`/notifications/${account}`) 
    await query.once('value', (data) => {
        if(data.exists()) {
            const subscription = data.toJSON()
            const payload = generateNotificaion()

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

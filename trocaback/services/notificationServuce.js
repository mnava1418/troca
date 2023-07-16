const admin = require('firebase-admin')

const updateSuscription = (account, subscription) => {
    const query = admin.database().ref(`/notifications/${account}`)
    query.update(subscription)
    .catch(error => {
        console.error(error)
    })
}

module.exports = {
    updateSuscription
}

/**
const webpush = require('web-push')
const auth = require('../config/auth')

/*webpush.setVapidDetails(auth.webPush.contact, auth.webPush.publicKey, auth.webPush.privateKey)

    const payload = JSON.stringify({
        title: 'Review your Order!',
        text: 'Order 123 has been updated. Click to open the order.',        
        url: `${auth.origin[process.env.NODE_ENV]}/orderBook`,        
    })    

    webpush.sendNotification(subscription, payload)
    .then(result => console.info(result))
    .catch(e => console.error(e.stack))

 */
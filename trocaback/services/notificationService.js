const admin = require('firebase-admin')
const auth = require('../config/auth')
const config = require('../config')
const userService = require('./userService')
const emailService = require('./emailService')

const updateSuscription = (account, subscription) => {
    const query = admin.database().ref(`/notifications/${account}`)
    query.update(subscription)
    .catch(error => {
        console.error(error)
    })
}

const generateOrderNotificaion = (order) => {
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

const generateSellNotification = (token) => {
    const payload = JSON.stringify({
        title: 'Token Sold!',
        text: `Congratulations! You just sold NFT #${token}`,
        url: `${auth.origin[process.env.NODE_ENV]}/portfolio`,        
    })    

    return payload
}

const generateNewAuctionNotification = (auctionId) => {
    const message = emailService.newAuctionMessage(auctionId)

    const payload = JSON.stringify({
        title: 'New Auction!',
        text: `Click for more details.`,
        url: `${auth.origin[process.env.NODE_ENV]}/auctions?${auctionId}`,        
        message
    })    

    return payload
}

const sendNotification = async (account, order, webpush, token = 0) => {
    const query = admin.database().ref(`/notifications/${account}`) 
    let notificationType = ''

    await query.once('value', (data) => {
        if(data.exists()) {
            const subscription = data.toJSON()
            let payload = ''

            if(token != 0) {
                payload = generateSellNotification(token)
                notificationType = config.notificationType.sell
            } else {
                payload = generateOrderNotificaion(order)
                notificationType = config.notificationType.order
            }            

            desktopNotification(subscription, payload, webpush)
        }
    })
    .catch(error => {
        console.error(error)
    })

    sendEmailNotification(account, notificationType, order, token)
}

const desktopNotification = (subscription, payload, webpush) => {
    webpush.sendNotification(subscription, payload)
    .catch(e => console.error(e.stack))
}

const sendEmailNotification = async(account, type, order, token) => {
    const userInfo = await userService.getUserInfo(account)

    if(userInfo && userInfo.email && userInfo.email.trim() !== '') {
        const message = type === config.notificationType.order ? emailService.orderNotificacionMessage(account, order.id) : emailService.sellNotificacionMessage(account, token)
        const subject = type === config.notificationType.order ? 'Review your Order!' : 'Token Sold!'
        emailService.sendEmail(userInfo.email, subject, message)
    }
}

const notifyAll = async (account, desktopPayload, webPush) => {
    desktopAll(account, desktopPayload, webPush) 

    const payload = JSON.parse(desktopPayload)
    emailAll(payload.title, payload.message)
}

const desktopAll = async(account, payload, webPush) => {
    const query = admin.database().ref('/notifications')
    let subscriptions = {}
    await query.once('value', (data) => {
        if(data.exists()) {
            subscriptions = data.toJSON()
        }        
    })
    .catch(error => {
        console.error(error)
    })

    Object.keys(subscriptions).forEach(id => {
        if(id !== account) {
            desktopNotification(subscriptions[id], payload, webPush)            
        }
    })
}

const emailAll = async(subject, message) => {
    const members = await userService.getValidatedMembers()
    const emails = members.map(member => member.email)    

    emailService.sendEmail(emails.toString(), subject, message)
}

module.exports = {
    updateSuscription,
    sendNotification,
    notifyAll,
    generateNewAuctionNotification,
}

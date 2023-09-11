const admin = require('firebase-admin')
const userService = require('./userService')
const auctionStatus = require('../config').auctionStatus

const creatAuction = async (account, token) => {
    const isUserInAuction = await userInAuction(account)

    if(isUserInAuction) {
        return {result: false, message: 'You already have an auction in progress.'}
    }
    
    const auctionId = Date.now()
    const {id, image, title, price} = token
    const auctionInfo = {tokenId: id, image, title, price, status: auctionStatus.new, account}

    const query = admin.database().ref(`/auctions/${auctionId}`) 
    const result = await query.update(auctionInfo)
    .then(async() => {
        const joinResult = await joinAuction(account, auctionId)
        return joinResult
    })
    .catch(error => {
        console.error(error)
        return false
    })

    if(result) {
        return {result: true, message: 'Auction created. Go to the auction panel when you are ready to initiate it.', auctionId}
    } else {
        return {result: false, message: 'Error creating auction. Please try again.'}
    }
}

const userInAuction = async (account) => {
    const userInfo = await userService.getUserInfo(account)

    if(userInfo && userInfo.auction){
        return true
    } else {
        return false
    }
}

const joinAuction = async (account, auction) => {
    const query = admin.database().ref(`/users/${account}`)
    const result = await query.update({auction})
    .then(() => true)
    .catch(error => {
        console.error(error)
        return false
    })

    return result
}

module.exports = {
    creatAuction
}
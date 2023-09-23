const admin = require('firebase-admin')
const userService = require('./userService')
const auctionStatus = require('../config').auctionStatus

const creatAuction = async (account, token) => {
    const userAuction = await userInAuction(account)

    if(userAuction.isInAuction) {
        return {result: false, message: 'You already have an auction in progress.'}
    }
    
    const auctionId = Date.now()
    const {id, image, title, price} = token
    const auctionInfo = {tokenId: id, image, title, price, status: auctionStatus.new, account, users: 0}

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
        return {result: true, message: 'Auction created. Go to the auction panel when you are ready to initiate it.', auctionId, auctionInfo}
    } else {
        return {result: false, message: 'Error creating auction. Please try again.'}
    }
}

const updateAuction = async(id, info) =>{
    const query = admin.database().ref(`/auctions/${id}`) 
    const result = await query.update(info)
    .then(() => true)
    .catch(error => {
        console.error(error)
        return false
    })

    return result
}

const userInAuction = async (account) => {
    const userInfo = await userService.getUserInfo(account)    

    if(userInfo && userInfo.auction){
        return {isInAuction: true, auctionId: userInfo.auction}
    } else {
        return {isInAuction: false}
    }
}

const joinAuction = async (account, auction, info = undefined) => {
    const query = admin.database().ref(`/users/${account}`)
    const result = await query.update({auction})
    .then(async() => {
        if(info) {
            const updateResult = await updateAuction(auction, info)   
            return updateResult
        } else {
            return true
        }
    })
    .catch(error => {
        console.error(error)
        return false
    })

    return result
}

const getUserAuction = async(account) => {
    const userInfo = await userService.getUserInfo(account)

    if(userInfo && userInfo.auction){
        return userInfo.auction.toString()
    } else {
        return undefined
    }
}

const getLiveAuctions = async (account) => {
    const userAuction = await getUserAuction(account)
    
    const liveAuctions = {}
    const query = admin.database().ref(`/auctions`) 
    
    await query.once('value', (data) => {
        if(data.exists()) {
            data = data.toJSON()

            if(userAuction) {
                liveAuctions[userAuction] = {...data[userAuction], id: userAuction.toString()}
            } else {
                Object.keys(data).forEach(id => {
                    if(id === userAuction || data[id].status === auctionStatus.new) {
                        liveAuctions[id] = {...data[id], id: id.toString()}
                    }
                })
            }            
        }
    })
    .catch(error => {
        console.error(error)      
    })

    return {userAuction, liveAuctions}
}

module.exports = {
    creatAuction,
    getLiveAuctions,
    updateAuction,
    userInAuction,
    joinAuction,
}
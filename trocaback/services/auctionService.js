const admin = require('firebase-admin')
const userService = require('./userService')
const ethService = require('./ethService')
const {auctionStatus, auctionMessages} = require('../config')

const auctionTimers = {}


const creatAuction = async (account, token) => {
    const userAuction = await userInAuction(account)

    if(userAuction.isInAuction) {
        return {result: false, message: 'You already have an auction in progress.'}
    }
    
    const auctionId = Date.now()
    const {id, image, title, price, key} = token
    const auctionInfo = {tokenId: id, tokenKey: key, image, title, price, status: auctionStatus.new, account, users: 0}

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

const markToken = (key, inAuction) => {
    const query = admin.database().ref(`/tokens/${key}`)
    query.update({inAuction})
    .catch(error => {
        console.log(error)
    })
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

const saveMessage = async(id, message) => {
    const query = admin.database().ref(`/auctions/${id}/messages/${message.id}`) 
    const {user, text} = message

    const result = await query.update({user, text})
    .then(() => true)
    .catch(error => {
        console.error(error)
        return false
    })

    return result
}

const updatePrice = async(id, price, account, io) => {
    let result = false
    result = await updateAuction(id, {price: price})

    if(result) {
        result = await priceHistory(id, {account, price})
    }
    
    if(result) {
        controlActiveInterval(id, price, account, io)
    }

    return result
}

const controlActiveInterval = (id, price, account, io) => {        
    if(!auctionTimers[id]) {
        auctionTimers[id] ={}
    }

    if(auctionTimers[id].active) {
        clearInterval(auctionTimers[id].active.interval)
    } else {
        auctionTimers[id].active = {}
    }
    
    const interval = setInterval((currentId, currentPrice, currentAccount) => {
        const messageId = Date.now()
        const message = {id: messageId, user: currentAccount, text: ''}

        if(auctionTimers[currentId].active.waitCount < 2) {
            auctionTimers[currentId].active.waitCount++
            message.text = `${currentPrice} ETH ${auctionMessages[auctionTimers[currentId].active.waitCount]}`
        } else {
            message.text = `User ${ethService.parseAccount(currentAccount)} won the auction! Waiting for the user to confirm transaction.`

            clearInterval(interval)

            updateAuction(currentId, {status: auctionStatus.pending})
            .then(async (result) => {
                if(result) {
                    const currentAuction = await getCurrentAuction(currentId)
                    const confirmAuction = {id: currentId, winner: currentAccount, token: {owner: currentAuction.account, id: currentAuction.tokenId, key: currentAuction.tokenKey, price: currentPrice}}
                    io.to(currentId.toString()).emit('auction-pending-confirmation', confirmAuction, auctionStatus.pending)
                }
            })

            saveMessage(currentId, message)
        }     

        io.to(currentId.toString()).emit('auction-message', currentId, message)
    }, 3000, id, price, account)

    auctionTimers[id].active.interval = interval
    auctionTimers[id].active.waitCount = 0
}

const priceHistory = async(id, info) => {
    const priceId = Date.now()
    const query = admin.database().ref(`/auctions/${id}/priceHistory/${priceId}`) 
    
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

const leaveAuction = async(account) => {
    const query = admin.database().ref(`/users/${account}`)
    await query.update({auction: null})    
    .catch(error => {
        console.error(error)        
    })
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
                    if(account === data[id].account || data[id].status === auctionStatus.new) {
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

const getCurrentAuction = async (auctionId) => {
    let currentAuction = {}
    const query = admin.database().ref(`/auctions/${auctionId}`)

    await query.once('value', (data) => {
        if(data.exists()) {
            currentAuction = data.toJSON()
        }
    })
    .catch(error => {
        console.error(error)
    })

    return currentAuction
}

const completeAuction = async (auctionId) => {
    updateAuction(auctionId, {status: auctionStatus.complete})

    const query = admin.database().ref('/users')
    const accountsToComplete = []

    await query.once('value', (data) => {        
        if(data.exists()) {  
            const users = data.toJSON()          
            Object.keys(users).forEach(account => {
                if(users[account].auction && users[account].auction.toString() === auctionId.toString()) {
                    accountsToComplete.push(leaveAuction(account))                    
                }
            })            
        }        
    })
    .catch(error => {
        console.error(error)
    })

    Promise.all(accountsToComplete)
    .catch(error => {
        console.error(error)
    })
}

module.exports = {
    creatAuction,
    getLiveAuctions,
    updateAuction,
    userInAuction,
    joinAuction,
    saveMessage,    
    updatePrice,
    getCurrentAuction,
    leaveAuction,
    completeAuction,
    markToken
}
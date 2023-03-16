const admin = require('firebase-admin')
const config = require('../config')

const getAllTokens = async () => {
    const query = admin.database().ref(`/tokens`)
    let tokens = {}

    await query.once('value', (data) => {
        if(data.exists()) {
             tokens = data.toJSON()
        }
    })
    .catch(error => {
        console.error(error)
        tokens = undefined
    })

    return tokens
}

const getAvailableTokens = async () => {
    const allTokens = await getAllTokens()
    const tokens = []

    if(tokens !== undefined) {
        Object.keys(allTokens).forEach(uri => {
            const tokenData = {...allTokens[uri], uri}
            tokens.push(tokenData)
        })  
    } 

    const available = tokens.filter( token => token.status === config.tokenStatus.available)

    return {totalCount: tokens.length, available}
}

module.exports = {
    getAllTokens,
    getAvailableTokens
}

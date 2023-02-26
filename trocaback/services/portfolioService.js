const admin = require('firebase-admin')

const getAllTokens = async () => {
    const query = admin.database().ref(`/tokens`)
    let tokens = []

    await query.once('value', (data) => {
        if(data.exists()) {
            const allTokens = data.toJSON()
            Object.keys(allTokens).forEach(uri => {
                const tokenData = {...allTokens[uri], uri}
                tokens.push(tokenData)
            })            
        }
    })
    .catch(error => {
        console.error(error)
        tokens = undefined
    })

    return tokens
}

module.exports = {
    getAllTokens
}

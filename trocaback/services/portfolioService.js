const admin = require('firebase-admin')

const getUserTokens = async (account) => {
    const query = admin.database().ref(`/tokens/${account}`)
    let tokens = undefined

    await query.once('value', (data) => {
        if(data.exists()) {
            tokens = data.toJSON()
        }
    })
    .catch(error => {
        console.error(error)
    })

    return tokens
}

module.exports = {
    getUserTokens
}

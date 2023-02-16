const admin = require('firebase-admin')

const getAllTokens = async () => {
    const query = admin.database().ref(`/tokens`)
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
    getAllTokens
}

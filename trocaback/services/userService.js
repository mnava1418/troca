const admin = require('firebase-admin')

const updateUserInfo = async (account, userInfo = {username: '', email: '', img: ''}) => {
    const query = admin.database().ref(`/users/${account}`)
    const result = await query.update(userInfo)
    .then(() => true)
    .catch( error => {
        console.error(error)
        return false
    })

    return result
}

const getUserInfo = async (account) => {
    const query = admin.database().ref(`/users/${account}`)
    let userInfo = undefined

    await query.once('value', (data) => {
        if(data.exists()) {
            userInfo = data.toJSON()
        }
    })
    .catch(error => {
        console.error(error)
    })

    return userInfo
}

module.exports = {
    getUserInfo,
    updateUserInfo
}

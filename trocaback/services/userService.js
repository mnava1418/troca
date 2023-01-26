const admin = require('firebase-admin')
const validator = require('validator')

const validateUserInfo = async (account, email, username) => {
    if(!email || email.trim() === '' || !username || username.trim() === '') {
        return {success: false, error: 'Email and Username are mandatory.'}
    }
    
    if(!validator.default.isEmail(email)) {
        return {success: false, error: 'Invalid email.'}
    }

    const users = await getAllUsers()
    
    if(users.byEmail[email] && users.byEmail[email] !== account) {
        return {success: false, error: `${email} is already used.`}
    }

    if(users.byUsername[username] && users.byUsername[username] !== account) {
        return {success: false, error: `${username} is already used.`}
    }

    return {success: true, error: ''}
}

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

const getAllUsers = async() => {
    const query = admin.database().ref('/users')
    const info = {byUsername: {}, byEmail: {}}

    await query.once('value', (data) => {
        if(data.exists()) {
            const currentInfo = data.toJSON()
            
            Object.keys(currentInfo).forEach(account => {
                if(currentInfo[account].username.trim() !== '') {
                    info.byUsername[currentInfo[account].username] = account
                }
                
                if(currentInfo[account].email.trim() !== '') {
                    info.byEmail[currentInfo[account].email] = account
                }                
            })
        }
    })
    .catch(error => {
        console.error(error)
    })

    return info
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
    updateUserInfo,
    validateUserInfo
}
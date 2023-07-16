const notificationService = require('../services/notificationServuce')

const subscribeUser = async (req, res) => {
    const {originalAccount, body} = req
    notificationService.updateSuscription(originalAccount, body)
    res.status(200).json({'success': true})
}

module.exports = {
    subscribeUser
}

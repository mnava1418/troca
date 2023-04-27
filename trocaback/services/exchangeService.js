const admin = require('firebase-admin')

const updateBid = (order) => {
    const query = admin.database().ref(`/orders/${order.id}`)
    query.update(order)
    .catch(error => {
        console.error(error)
    })
}

module.exports = {
    updateBid
}

const ethService = require('./ethService')

const updatePrice = async(uri, price) => {
    await ethService.updateMetaData(uri, {price})
}

module.exports = {    
    updatePrice,    
}

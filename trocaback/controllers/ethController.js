const ethService = require('../services/ethService')

const saveNFTMetaData = async (req, res) => {
    const {title, description, price} = req.body
    const imgData = req.file
    const result = await ethService.saveNFTMetaData(title, description, price, imgData.buffer)

    if(result ) {
        res.status(200).json({message: 'Info saved! Token will be part of the collection.'})
    } else {
        res.status(500).json({error: 'Unable to save metadata.'})
    }
}

module.exports = {
    saveNFTMetaData
}
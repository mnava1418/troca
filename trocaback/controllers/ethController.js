const ethService = require('../services/ethService')

const saveNFTMetaData = async (req, res) => {
    const {title, description} = req.body
    const imgData = req.file
    const metaData = await ethService.saveNFTMetaData(title, description, imgData.buffer)

    if(metaData === '') {
        res.status(500).json({error: 'Unable to save metadata.'})
    } else {
        res.status(200).json({metaData})
    }
}

module.exports = {
    saveNFTMetaData
}
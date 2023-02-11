const ethService = require('../services/ethService')

const saveNFTMetaData = async (req, res) => {
    const {title, description, price, royalties} = req.body
    const imgData = req.file
    const result = await ethService.saveNFTMetaData(req.originalAccount, title, description, price, royalties, imgData.buffer)

    if(result ) {
        res.status(200).json({message: 'Info saved! You will be able to mint after your token is approved. You can check the status on your portfolio.'})
    } else {
        res.status(500).json({error: 'Unable to save metadata.'})
    }
}

module.exports = {
    saveNFTMetaData
}
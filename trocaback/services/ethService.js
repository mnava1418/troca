const infuraAuth = require('../config/auth').infura
const config = require('../config')

const getClient = async () => {
    const { create } = await import('ipfs-http-client')
    const auth = 'Basic ' + Buffer.from(`${infuraAuth.projectId}:${infuraAuth.secret}`).toString('base64')

    const client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        }
    })

    return client
}

const ipfsUploadImg = async (imgData, client = undefined) => {
    if(client === undefined) {
        client = await getClient()
    }

    const path = await client.add(imgData)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    return path
}

const saveNFTMetaData = async (title, description, imgData) => {
    const client = await getClient()
    const imgPath = await ipfsUploadImg(imgData, client)

    if(imgPath === '') return imgPath
    
    const metaBuffer = Buffer.from(JSON.stringify({title, description, image: `${config.infuraUrl}/${imgPath}`}));
    
    const path = await client.add(metaBuffer)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    return path
}

module.exports = {
    ipfsUploadImg,
    saveNFTMetaData
}

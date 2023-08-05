const admin = require('firebase-admin')
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

const saveNFTMetaData = async (title, description, price, imgData) => {
    const client = await getClient()
    const image = await ipfsUploadImg(imgData, client)

    if(image === '') return false

    const metaData = {
        name: title,
        description,
        image: `${config.infuraUrl}/${image}`
    }

    const metaBuffer = Buffer.from(JSON.stringify(metaData));

    const uri = await client.add(metaBuffer)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    if(uri === '') return false

    const result = await updateMetaData(uri, {title, description, image, price, status: config.tokenStatus.available})
    return result
}

const updateMetaData = async (uri, metaData) => {
    const query = admin.database().ref(`/tokens/${uri}`)
    const result = await query.update(metaData)
    .then(() => true)
    .catch( error => {
        console.error(error)
        return false
    })

    return result
}

module.exports = {
    ipfsUploadImg,
    saveNFTMetaData,
    updateMetaData
}

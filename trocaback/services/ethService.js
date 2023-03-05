const admin = require('firebase-admin')
const infuraAuth = require('../config/auth').infura
const config = require('../config')

const META_DATA = {
    title: 'TROCA Metadata',
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: ''
        },
        description: {
            type: 'string',
            description: ''
        },
        image: {
            type: 'string',
            description: ''
        }
    }
}

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

const saveNFTMetaData = async (title, description, price, royalties, imgData) => {
    const client = await getClient()
    const image = await ipfsUploadImg(imgData, client)

    if(image === '') return false

    META_DATA.properties.name.description = title
    META_DATA.properties.description.description = description
    META_DATA.properties.image.description = `${config.infuraUrl}/${image}`

    const metaBuffer = Buffer.from(JSON.stringify(META_DATA));

    const uri = await client.add(metaBuffer)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    if(uri === '') return false

    const result = await updateMetaData(uri, {title, description, image, royalties, price, status: config.tokenStatus.available})
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

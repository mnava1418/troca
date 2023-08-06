const admin = require('firebase-admin')
const auth = require('../config/auth')
const config = require('../config')

const infuraAuth = auth.infura
const huggingFaceAuth = auth.huggingFace

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

    if(image === '') return undefined

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

    if(uri === '') return undefined

    const result = await updateMetaData(uri, {title, description, image, price})

    if(result) return {uri, title, description, image, price}

    return undefined
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

const generateTokenImage = async (description) => {
    const tokenImage = await fetch(config.huggingFaceURL, {
        headers: { Authorization: `Bearer ${huggingFaceAuth.token}`},
        method: 'POST',
        body: JSON.stringify({
            inputs: description,
            options: {wait_for_model: true}
        })
    })
    .then(async response => {        
        response = await response.blob()
        response = await response.arrayBuffer()
        return response
    })
    .catch(error => {
        console.error(error)
        return undefined
    })

    return tokenImage    
}

module.exports = {
    ipfsUploadImg,
    saveNFTMetaData,
    updateMetaData,
    generateTokenImage
}

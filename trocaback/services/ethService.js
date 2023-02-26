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

const saveNFTMetaData = async (account, title, description, price, royalties, imgData) => {
    const client = await getClient()
    const imgPath = await ipfsUploadImg(imgData, client)

    if(imgPath === '') return false
    
    const metaBuffer = Buffer.from(JSON.stringify({title, description, royalties, image: `${config.infuraUrl}/${imgPath}`}));
    
    const path = await client.add(metaBuffer)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    if(path === '') return false

    const result = await updateMetaData(account, path, {title, description, royalties, price, imgPath, status: config.tokenStatus.pending})
    return result
}

const updateMetaData = async (account, path, metaData) => {
    const timestamp = Date.now().toString()
    const query = admin.database().ref(`/tokens/${path}`)
    const result = await query.update({owner: account, timestamp, ...metaData})
    .then(() => true)
    .catch( error => {
        console.error(error)
        return false
    })

    return result
}

module.exports = {
    ipfsUploadImg,
    saveNFTMetaData
}

const infuraAuth = require('../config/auth').infura

const ipfsUploadImg = async (imgData) => {
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

    const path = await client.add(imgData)
    .then(result => result.path)
    .catch(error => {
        console.error(error)
        return ''
    })

    return path
}

module.exports = {
    ipfsUploadImg
}

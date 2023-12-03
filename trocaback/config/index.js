module.exports = {
    infuraUrl: 'https://troca.infura-ipfs.io/ipfs',

    tokenStatus: {
        available: 'AVAILABLE',
        minting: 'MINTING',
        minted: 'MINTED'
    },

    bidStatus: {
        new: 'NEW',
        reject: 'REJECTED',    
        accept: 'PENDING_CONFIRMATION',
        complete: 'COMPLETED'
    },

    notificationType: {
        order: 'ORDER',
        sell: 'SELL'
    },

    auctionStatus: {
        new: 'NEW',
        live: 'LIVE',
        pending: 'PENDING_CONFIRMATION',
        end: 'END',
        complete: 'COMPLETE'
    },

    auctionMessages: {
        1: 'once',
        2: 'twice'
    },

    huggingFaceURL: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',

    email: 'martin@mnavapena.com'
}
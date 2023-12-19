export const PATHS = {
    main: '/',
    wallet: '/wallet',
    profile: '/profile',
    create: '/create',
    portfolio: '/portfolio',
    mint: '/mint',
    orderBook: '/orderBook',
    auctions: '/auctions'
}

export const SIGN_MESSAGE = 'Please sign this message to validate you are the owner of the wallet. This request will not generate any cost or gas fees. Your authentication status will reset after 24 hours.'

export const BACK_URLS = {
    development: 'http://localhost:9000',
    production: 'https://trocaa-029b6e768b1b.herokuapp.com',
}

export const INFURA_URL = 'https://troca.infura-ipfs.io/ipfs'

export const MEMBERSHIP_FEE = 10 //USD

export const TOKEN_STATUS = {
    active: 'ACTIVE'
}

export const MINTING_STATUS = {    
    minting: 'MINTING',
    waiting_confirmation: 'WAITING_CONFIRMATION'
}

export const BID_STATUS = {
    new: 'NEW',
    seller: 'WAITING_ON_SELLER',
    buyer: 'WAITING_ON_BUYER',
    reject: 'REJECTED',    
    pending: 'PENDING',
    accept: 'PENDING_CONFIRMATION',
    complete: 'COMPLETED'
}

export const BID_ACTIONS = {
    create: 'CREATE',
    reject: 'REJECT',
    update: 'UPDATE',
    accept: 'ACCEPT',
    confirm: 'CONFIRM'
}

export const AUCTION_STATUS = {
    new: 'NEW',
    live: 'LIVE',
    pending: 'PENDING_CONFIRMATION'
}

export const AUCTION_ACTIONS = {
    start: 'START',
    join: 'JOIN',
    update: 'UPDATE'
}

export const ETHER_SCAN_URLS = {
    5777: 'https://sepolia.etherscan.io/address/',
    11155111: 'https://sepolia.etherscan.io/address/',
    1: 'https://etherscan.io/address/',
}
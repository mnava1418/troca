import { get } from '../services/networkService'
import { BACK_URLS, INFURA_URL } from '../config'

import { setIsProcessing, setAlert } from '../store/slices/statusSlice'
import { loadTokens } from '../store/slices/portfolioSlice'
import { parseError } from '../services/ethServices'

class MyPortfolio {
    constructor (dispatch) {
        this.dispatch = dispatch
        this.baseURL = BACK_URLS[process.env.NODE_ENV]
    }

    async loadTokens(nft, catalog) {
        const tokens = {}

        const tokenId = await nft.methods.tokenId().call()
        .then(result => parseInt(result))
        
        if(tokenId !== 0) {
            for(let i = 1; i <= tokenId; i++) {
                const owner = await nft.methods.ownerOf(i).call()
                const uri = await nft.methods.tokenURI(i).call()
                const key = uri.split('/').pop()
                
                tokens[i] = {
                    id: i, 
                    owner, 
                    uri,
                    key,
                    title: catalog[key].title,
                    image: catalog[key].image,
                    imageData: undefined,
                    price: catalog[key].price,
                    description: catalog[key].description,
                    royalties: catalog[key].royalties
                }
            }
        } 

        return tokens
    }

    async getTokens(nft) {
        this.dispatch(setIsProcessing(true))

        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/portfolio', token)

        if(response.status === 200) {
            const tokens = await this.loadTokens(nft, response.data.tokens)
            this.dispatch(loadTokens(tokens))
        } else {
            this.dispatch(setAlert({show: true, type: 'danger', text: response.data.error}))
        }
        this.dispatch(setIsProcessing(false))
    }

    mint(account, nft, troca, token) {
        const mintPromise = new Promise((resolve, reject) => {
            const uri = `${INFURA_URL}/${token.uri}`
            const royalties = parseInt(token.royalties) * 100 //In basis points

            nft.methods.mint(troca._address, uri, royalties).send({from: account})
            .on('transactionHash', () => {
                resolve()
            })
            .on('error', (error) => {
                console.error(error)
                const errorMessage = parseError(error)
                reject(errorMessage)
            })
        })        

        return mintPromise
    }

    list (account, nft, troca, id) {
        nft.methods.approve(troca._address, id).send({from: account})
        .on('transactionHash', () => {
            this.dispatch(setAlert({show: true, type: 'success', text: 'NFT listed!'}))
        })
        .on('error', (error) => {
            console.error(error)
            const errorMessage = parseError(error)
            this.dispatch(setAlert({show: true, type: 'danger', text: errorMessage}))
        })
    }

    listAll() {
        console.log('List all my NFTs')
    }
}

export default MyPortfolio
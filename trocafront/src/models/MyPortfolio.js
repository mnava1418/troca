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

    async getTokens() {
        this.dispatch(setIsProcessing(true))
        
        const token = localStorage.getItem('jwt')
        const response = await get(this.baseURL, '/portfolio', token)

        if(response.status === 200) {
            this.dispatch(loadTokens(response.data.tokens))
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
}

export default MyPortfolio
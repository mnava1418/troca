import { createSlice } from '@reduxjs/toolkit'
import { TOKEN_STATUS } from '../../config'

const INITIAL_STATE = {
    allTokens: [],
    selectedTokens: [],    
    onlyUser: false,    
}

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: INITIAL_STATE,
    reducers: {
        loadTokens: (state, action) => {
            state.allTokens = action.payload
            state.selectedTokens = action.payload
        },

        setOnlyUser: (state, action) => {
            state.onlyUser = action.payload
        }
    }
})

//Actions
export const {
    loadTokens,
    setOnlyUser
} = portfolioSlice.actions

//Selectors
export const portfolioTokensSelector = (state) => {
    const account = state.status.connection.account
    const tokens = state.portfolio.selectedTokens
    const onlyUser = state.portfolio.onlyUser

    const result = []

    if( onlyUser ) {
        tokens.forEach(element => {
            if(element.owner === account) {
                result.push(element)
            }
        })
    } else {        
        tokens.forEach(element => {
            if(element.owner !== account) {
                result.push(element)
            }
        })
    }

    return result
}

export const onlyUserSelector = (state) => state.portfolio.onlyUser

export default portfolioSlice.reducer

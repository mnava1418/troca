import { createSlice } from '@reduxjs/toolkit'
import { TOKEN_STATUS } from '../../config'

const INITIAL_STATE = {
    tokens: {},
    onlyUser: false,
}

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: INITIAL_STATE,
    reducers: {
        loadTokens: (state, action) => {
            state.tokens = action.payload
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
    const tokens = state.portfolio.tokens
    const onlyUser = state.portfolio.onlyUser

    const result = {}

    if( onlyUser ) {
        Object.keys(tokens).forEach(key => {
            if(tokens[key].owner === account) {
                result[key] = {...tokens[key]}
            }
        })
    } else {
        Object.keys(tokens).forEach(key => {
            if(tokens[key].owner !== account && tokens[key].status === TOKEN_STATUS.active ) {
                result[key] = {...tokens[key]}
            }
        })
    }

    return result
}

export const onlyUserSelector = (state) => state.portfolio.onlyUser

export default portfolioSlice.reducer

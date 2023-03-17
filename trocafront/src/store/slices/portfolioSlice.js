import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    allTokens: {},
    selectedTokens: [],
    users: {},
    onlyUser: true,    
}

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: INITIAL_STATE,
    reducers: {
        loadTokens: (state, action) => {
            state.allTokens = action.payload
            state.selectedTokens = Object.values(action.payload)
        },

        setOnlyUser: (state, action) => {
            state.onlyUser = action.payload
        },

        loadUsers: (state, action) => {
            state.users = action.payload            
        },

        setSelectedTokens: (state, action) => {
            state.selectedTokens = action.payload
        },

        loadTokenImg: (state, action) => {
            state.allTokens[action.payload.id].imageData = action.payload.data
        }
    }
})

//Actions
export const {
    loadTokens,
    setOnlyUser,
    loadUsers,
    setSelectedTokens, 
    loadTokenImg
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

export const usersSelector = (state) => state.portfolio.users

export const allTokensSelector = (state) => state.portfolio.allTokens

export default portfolioSlice.reducer

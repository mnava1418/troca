import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

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
        },

        updateTokenPrice: (state, action) => {
            if(state.allTokens[action.payload.id]) {
                state.allTokens[action.payload.id].price = action.payload.price
            }
            
            state.selectedTokens.forEach(token => {
                if(token.id === action.payload.id) {
                    token.price = action.payload.price
                }
            })
        },

        listToken: (state, action) => {
            if(state.allTokens[action.payload.id]) {
                state.allTokens[action.payload.id].isListed = true
            }
            
            state.selectedTokens.forEach(token => {
                if(token.id === action.payload.id) {
                    token.isListed = true
                }
            })
        },

        tokenInAuction: (state, action) => {
            if(state.allTokens[action.payload.id]) {
                state.allTokens[action.payload.id].inAuction = action.payload.inAuction
            }
            
            state.selectedTokens.forEach(token => {
                if(token.id === action.payload.id) {
                    token.inAuction = action.payload.inAuction
                }
            })
        },

        transferToken: (state, action) => {
            if(state.allTokens[action.payload.id]) {
                state.allTokens[action.payload.id].isListed = false
                state.allTokens[action.payload.id].owner = action.payload.newOwner
            }
            
            state.selectedTokens.forEach(token => {
                if(token.id === action.payload.id) {
                    token.isListed = false
                    token.owner = action.payload.newOwner
                }
            })
        }
    }
})

//Actions
export const {
    loadTokens,
    setOnlyUser,
    loadUsers,
    setSelectedTokens, 
    loadTokenImg,
    updateTokenPrice,
    listToken,
    transferToken,
    tokenInAuction
} = portfolioSlice.actions

//Selectors
const getAccountSelector = (state) => state.status.connection.account
const getTokensSelector = (state) => state.portfolio.selectedTokens
const getOnlyUserSelector = (state) => state.portfolio.onlyUser


export const portfolioTokensSelector = createSelector(
    getAccountSelector,
    getTokensSelector,
    getOnlyUserSelector,
    (account, tokens, onlyUser) => {
        const result = []
        
        if( onlyUser ) {
        tokens.forEach(element => {
            if(element.owner === account) {
                result.push({...element})
            }
        })
        } else {        
            tokens.forEach(element => {
                if(element.owner !== account && element.isListed && !element.inAuction) {
                    result.push({...element})
                }
            })
        }

        return [...result]
    }
)

export const onlyUserSelector = (state) => state.portfolio.onlyUser

export const usersSelector = (state) => state.portfolio.users

export const allTokensSelector = (state) => state.portfolio.allTokens

export default portfolioSlice.reducer

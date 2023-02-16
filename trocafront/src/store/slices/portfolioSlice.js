import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    tokens: {}
}

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: INITIAL_STATE,
    reducers: {
        loadTokens: (state, action) => {
            state.tokens = action.payload
        }
    }
})

//Actions
export const {
    loadTokens
} = portfolioSlice.actions

//Selectors

export default portfolioSlice.reducer

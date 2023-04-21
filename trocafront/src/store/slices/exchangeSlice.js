import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    show: false
}

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: INITIAL_STATE,
    reducers: {
        showExchange: (state, action) => {
            state.show = action.payload.show
        }
    }
})

//Actions
export const {
    showExchange
} = exchangeSlice.actions

//Selectors
export const showExchangeSelector = (state) => state.exchange.show

export default exchangeSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    show: false,
    order: {
        id: 0,
        seller: '',
        sellerData: undefined,
        buyer: '',
        buyerData: undefined,
        price: 0.0,
        status: '',
    }
}

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: INITIAL_STATE,
    reducers: {
        showExchange: (state, action) => {
            state.show = action.payload.show

            if(action.payload.show && action.payload.order !== undefined) {
                state.order = action.payload.order
            } else {
                state.order = {...INITIAL_STATE.order}
            }
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
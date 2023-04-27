import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    show: false,
    order: {
        id: 0,
        seller: '',
        sellerTokenId: 0,
        buyer: '',
        buyerTokenId: 0,
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
        },

        updateOrderToken: (state, action) => {
            state.order.buyerTokenId = action.payload.id
        }
    }
})

//Actions
export const {
    showExchange,
    updateOrderToken
} = exchangeSlice.actions

//Selectors
export const showExchangeSelector = (state) => state.exchange.show
export const bidOrderSelector = (state) => state.exchange.order


export default exchangeSlice.reducer
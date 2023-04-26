import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    show: false,
    catalog: {},
    order: {
        id: 0,
        seller: '',
        sellerId: 0,
        sellerData: undefined,
        buyer: '',
        buyerId: 0,
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
        },

        updateCatalog: (state, action) => {
            state.catalog[action.payload.account] = action.payload.tokens
        },

        updateOrderToken: (state, action) => {
            state.order.buyerId = action.payload.id
            state.order.buyerData = action.payload.data
        }
    }
})

//Actions
export const {
    showExchange,
    updateCatalog,
    updateOrderToken
} = exchangeSlice.actions

//Selectors
export const showExchangeSelector = (state) => state.exchange.show
export const bidOrderSelector = (state) => state.exchange.order
export const catalogSelector = (state) => state.exchange.catalog

export default exchangeSlice.reducer
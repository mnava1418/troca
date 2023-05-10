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
    },
    orderBook: []
}

localStorage.setItem('showOrder', INITIAL_STATE.show)
localStorage.setItem('orderId', INITIAL_STATE.order.id)

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: INITIAL_STATE,
    reducers: {
        showExchange: (state, action) => {
            state.show = action.payload.show
            localStorage.setItem('showOrder', action.payload.show)

            if(action.payload.show && action.payload.order !== undefined) {
                state.order = action.payload.order
                localStorage.setItem('orderId', action.payload.order.id)
            } else {
                state.order = {...INITIAL_STATE.order}
                localStorage.setItem('orderId', INITIAL_STATE.order.id)
            }
        },

        updateOrderToken: (state, action) => {
            state.order.buyerTokenId = action.payload.id
        },

        updateOrderStatus: (state, action) => {
            state.order.status = action.payload.status
        },

        loadOrderBook: (state, action) => {
            state.orderBook = action.payload.orderBook
        }
    }
})

//Actions
export const {
    showExchange,
    updateOrderToken,
    updateOrderStatus,
    loadOrderBook
} = exchangeSlice.actions

//Selectors
export const showExchangeSelector = (state) => state.exchange.show
export const bidOrderSelector = (state) => state.exchange.order

export const orderBookSelector = (state) => { 
    const orderBook = [...state.exchange.orderBook]
    orderBook.sort((a, b) => a.id <= b.id ? 1 : -1)
    return orderBook.slice(0,101)
}

export default exchangeSlice.reducer
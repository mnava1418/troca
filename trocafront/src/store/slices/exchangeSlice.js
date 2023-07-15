import { createSlice } from '@reduxjs/toolkit'
import { BID_STATUS } from '../../config'

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
    orderBook: {},
    orderChanged: false,
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
            state.orderChanged = true

            if(state.order.status !== BID_STATUS.new) {
                state.order.status = BID_STATUS.pending
            }            
        },

        updateOrderPrice: (state, action) => {
            state.order.price = parseFloat(action.payload)
            state.orderChanged = true

            if(state.order.status !== BID_STATUS.new) {
                state.order.status = BID_STATUS.pending
            }            
        },

        updateOrderStatus: (state, action) => {
            state.order.status = action.payload.status
            state.orderChanged = false
        },

        loadOrderBook: (state, action) => {
            state.orderBook = action.payload.orderBook
        },

        updateOrder: (state, action) => {
            state.orderBook[action.payload.order.id] = action.payload.order
        },

        switchTokens: (state) => {
            const tempToken = state.order.buyerTokenId
            state.order.buyerTokenId = state.order.sellerTokenId
            state.order.sellerTokenId = tempToken
        }
    }
})

//Actions
export const {
    showExchange,
    updateOrderToken,
    updateOrderPrice,
    updateOrderStatus,
    loadOrderBook,
    updateOrder,
    switchTokens
} = exchangeSlice.actions

//Selectors
export const showExchangeSelector = (state) => state.exchange.show
export const bidOrderSelector = (state) => state.exchange.order
export const orderChangedSelector = (state) => state.exchange.orderChanged

export const orderBookSelector = (state) => { 
    const orderBook = [...Object.values(state.exchange.orderBook)]
    orderBook.sort((a, b) => a.id <= b.id ? 1 : -1)
    return orderBook.slice(0,101)
}

export default exchangeSlice.reducer
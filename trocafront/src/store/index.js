import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import statusReducer from './slices/statusSlice'
import contractsReducer from './slices/contractsSlice'
import portfolioReducer from './slices/portfolioSlice'
import exchangeReducer from './slices/exchangeSlice'
import auctionReducer from './slices/auctionSlice'

export default configureStore({
    reducer : {
        status: statusReducer,
        contracts: contractsReducer,
        portfolio: portfolioReducer,
        exchange: exchangeReducer,
        auction: auctionReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
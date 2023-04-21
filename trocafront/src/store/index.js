import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import statusReducer from './slices/statusSlice'
import contractsReducer from './slices/contractsSlice'
import portfolioReducer from './slices/portfolioSlice'
import exchangeReducer from './slices/exchangeSlice'

export default configureStore({
    reducer : {
        status: statusReducer,
        contracts: contractsReducer,
        portfolio: portfolioReducer,
        exchange: exchangeReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
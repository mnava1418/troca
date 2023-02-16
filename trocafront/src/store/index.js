import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import statusReducer from './slices/statusSlice'
import contractsReducer from './slices/contractsSlice'
import portfolioReducer from './slices/portfolioSlice'

export default configureStore({
    reducer : {
        status: statusReducer,
        contracts: contractsReducer,
        portfolio: portfolioReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
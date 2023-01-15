import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import statusReducer from './slices/statusSlice'
import contractsReducer from './slices/contractsSlice'

export default configureStore({
    reducer : {
        status: statusReducer,
        contracts: contractsReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
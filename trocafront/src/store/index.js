import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import statusReducer from './slices/statusSlice'

export default configureStore({
    reducer : {
        status: statusReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
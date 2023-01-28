import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    isProcessing: false,
    alert: {
        show: false,
        title: '',
        text: '',
        type: ''
    },
    connection: {
        isConnected: false,
        isOnline: false,
        isMember: false,
        account: undefined,
        userInfo: {
            username: '',
            email: '',
            img: ''
        }
    }
}

export const statusSlice = createSlice({
    name: 'status',
    initialState: INITIAL_STATE,
    reducers: {
        setAlert: (state, action) => {
            state.alert = action.payload
        },

        closeAlert: (state) => {
            state.alert.show = false
        },

        setIsProcessing: (state, action) => {
            state.isProcessing = action.payload
        },

        connectUser: (state, action) => {
            state.connection.isConnected = true
            state.connection.account = action.payload.account
            state.connection.isMember = action.payload.isMember
        },

        disconnectUser: (state) => {
            state.connection = { isConnected: false, isOnline: false, isMember: false, account: undefined,
                userInfo: {
                    username: '',
                    email: '',
                    img: ''
                }
            }
        },

        setUserInfo: (state, action) => {
            state.connection.userInfo = action.payload
        },

        updateUserName: (state, action) => {
            state.connection.userInfo.username = action.payload
        }
    }
})

//Actions
export const {
    setAlert,
    closeAlert,
    setIsProcessing,
    connectUser,
    disconnectUser,
    setUserInfo,
    updateUserName
} = statusSlice.actions

//Selectors
export const alertSelector = (state) => state.status.alert
export const isProcessingSelector = (state) => state.status.isProcessing
export const connectionStatusSelector = (state) => state.status.connection

export default statusSlice.reducer

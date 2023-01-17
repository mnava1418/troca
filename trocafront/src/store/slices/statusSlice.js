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
        account: undefined,
        userInfo: {
            username: '',
            email: '',
            img: '',
            isMember: false
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
            state.connection.account = action.payload
        },

        disconnectUser: (state) => {
            state.connection = { isConnected: false, isOnline: false, account: undefined,
                userInfo: {
                    username: '',
                    email: '',
                    img: '',
                    isMember: false
                }
            }
        },

        setUserInfo: (state, action) => {
            state.connection.userInfo = action.payload
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
    setUserInfo
} = statusSlice.actions

//Selectors
export const alertSelector = (state) => state.status.alert
export const isProcessingSelector = (state) => state.status.isProcessing
export const connectionStatusSelector = (state) => state.status.connection

export default statusSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    isProcessing: false,
    alert: {
        show: false,        
        text: '',
        type: '',
        action: undefined,
        actionId: undefined,
    },
    connection: {
        socket: undefined,
        isConnected: false,
        isOnline: false,
        isMember: false,
        isOwner: false,
        account: undefined,
        userInfo: {
            username: '',
            email: '',
            img: ''
        }
    },
    chatUsers: {}
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
            state.connection.isOwner = action.payload.isOwner
            state.connection.socket = action.payload.socket
        },

        disconnectUser: (state) => {
            if(state.connection.socket) {
                state.connection.socket.disconnect()
            }
            
            state.connection = { isConnected: false, isOnline: false, isMember: false, isOwner: false, account: undefined, socket: undefined,
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
        },

        setIsMember: (state, action) => {
            state.connection.isMember = action.payload
        },

        connectChat: (state, action) => {
            state.connection.isOnline = action.payload.isOnline
        },

        updateChatUsers: (state, action) => {
            state.chatUsers = action.payload.chatUsers
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
    updateUserName,
    setIsMember,
    connectChat,
    updateChatUsers
} = statusSlice.actions

//Selectors
export const alertSelector = (state) => state.status.alert
export const isProcessingSelector = (state) => state.status.isProcessing
export const connectionStatusSelector = (state) => state.status.connection
export const chatUsersSelector = (state) => state.status.chatUsers

export default statusSlice.reducer

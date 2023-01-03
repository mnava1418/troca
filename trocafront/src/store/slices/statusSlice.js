import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    alert: {
        show: false,
        title: '',
        text: '',
        type: ''
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
        }
    }
})

//Actions
export const {
    setAlert,
    closeAlert
} = statusSlice.actions

//Selectors
export const alertSelector = (state) => state.status.alert

export default statusSlice.reducer

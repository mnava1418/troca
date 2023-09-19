import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    liveAuctions: {}
}

export const auctionSlice = createSlice({
    name: 'auction',
    initialState: INITIAL_STATE,
    reducers: {
        setLiveAuctions: (state, action) => {
            state.liveAuctions = action.payload.liveAuctions
        }
    }
})

//Actions
export const {
    setLiveAuctions
} = auctionSlice.actions

//Selectors

export default auctionSlice.reducer
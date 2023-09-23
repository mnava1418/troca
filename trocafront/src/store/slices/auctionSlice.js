import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    liveAuctions: {},
    currentAuction: undefined
}

export const auctionSlice = createSlice({
    name: 'auction',
    initialState: INITIAL_STATE,
    reducers: {
        setLiveAuctions: (state, action) => {
            state.liveAuctions = action.payload.liveAuctions
        },

        selectAuction: (state, action) => {            
            if(state.liveAuctions.hasOwnProperty(action.payload)) {
                state.currentAuction = state.liveAuctions[action.payload]
            } else {
                state.currentAuction = undefined
            }
        }
    }
})

//Actions
export const {
    setLiveAuctions,
    selectAuction
} = auctionSlice.actions

//Selectors
export const liveAuctionsSelector = (state) => state.auction.liveAuctions
export const currentAuctionSelector = (state) => state.auction.currentAuction

export default auctionSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import { AUCTION_STATUS } from '../../config'

const INITIAL_STATE = {
    liveAuctions: {},
    currentAuction: undefined,
    userAuction: undefined
}

export const auctionSlice = createSlice({
    name: 'auction',
    initialState: INITIAL_STATE,
    reducers: {
        setLiveAuctions: (state, action) => {
            const {liveAuctions, userAuction} = action.payload
            state.liveAuctions = liveAuctions
            state.userAuction = userAuction
        },

        selectAuction: (state, action) => {            
            if(state.liveAuctions.hasOwnProperty(action.payload)) {
                state.currentAuction = {...state.liveAuctions[action.payload], id: action.payload}
            } else {
                state.currentAuction = undefined
            }
        },

        showMessage: (state, action) => {
            const {id, message} =  action.payload

            if(state.currentAuction.id === id) {
                if(!state.currentAuction.hasOwnProperty('messages')) {
                    state.currentAuction.messages = []
                }

                state.currentAuction.messages.push(message)                
            }
        },

        userJoin: (state, action) => {            
            const {id} =  action.payload

            if(state.currentAuction && state.currentAuction.id === id) {
                state.currentAuction.users +=1
            }

            if(state.liveAuctions[id]) {
                state.liveAuctions[id].users +=1
            }
        },

        updateUserAuction: (state, action) => {
            const {id} = action.payload
            state.userAuction = id
            
            const lives = {}
            lives[id] = state.liveAuctions[id]
            state.liveAuctions = lives            
        },

        updateAuctionsList: (state, action) => {
            if(state.userAuction === undefined) {                
                const {id, auction} = action.payload
                state.liveAuctions[id] = {...auction, id: id.toString()}
            }
        },

        startAuction: (state, action) => {
            const id = action.payload.id.toString()

            if(state.currentAuction && state.currentAuction.id.toString() === id ) {                
                state.currentAuction.status = AUCTION_STATUS.live
            }

            if(state.liveAuctions[id]) {                
                state.liveAuctions[id].status = AUCTION_STATUS.live

                if(state.userAuction === undefined || state.userAuction !== id) {
                    delete state.liveAuctions[id]
                }
            }
        }
    }
})

//Actions
export const {
    setLiveAuctions,
    selectAuction,
    showMessage,
    userJoin,
    updateUserAuction,
    updateAuctionsList,
    startAuction
} = auctionSlice.actions

//Selectors
export const liveAuctionsSelector = (state) => { 
    const liveAuctions = state.auction.liveAuctions
    const userAuction = state.auction.userAuction
    return {liveAuctions, userAuction}
}

export const currentAuctionSelector = (state) => state.auction.currentAuction

export default auctionSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    web3: undefined,
    contracts: {
        troca: undefined,
        nft: undefined
    }
}

export const contractsSlice = createSlice({
    name: 'contracts',
    initialState: INITIAL_STATE,
    reducers: {
        loadContractData: (state, action) => {
            state.web3 = action.payload.web3
            state.contracts = action.payload.contracts
        }
    }
})

//Actions
export const {
    loadContractData
} = contractsSlice.actions

//Selectors
export const web3Selector = (state) => state.contracts.web3
export const contractsSelector = (state) => state.contracts.contracts

export default contractsSlice.reducer

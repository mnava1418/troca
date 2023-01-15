import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    web3: undefined,
    contracts: undefined
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

export default contractsSlice.reducer

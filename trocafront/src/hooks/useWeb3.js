import { useSelector } from 'react-redux'
import {  web3Selector, contractsSelector } from '../store/slices/contractsSlice'

function useWeb3() {
    const web3 = useSelector(web3Selector)
    const { troca, nft } = useSelector(contractsSelector)

    return { web3, troca, nft }
}

export default useWeb3

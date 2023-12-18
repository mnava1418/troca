import { useSelector } from 'react-redux'
import {  web3Selector, contractsSelector, networkIdSelector } from '../store/slices/contractsSlice'

function useWeb3() {
    const web3 = useSelector(web3Selector)
    const { troca, nft } = useSelector(contractsSelector)
    const networkId = useSelector(networkIdSelector)

    return { web3, troca, nft, networkId }
}

export default useWeb3

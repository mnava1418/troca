import { useSelector } from 'react-redux'
import { portfolioTokensSelector, onlyUserSelector } from '../store/slices/portfolioSlice'

function usePortfolio() {
    const selectedTokens = useSelector(portfolioTokensSelector)
    const onlyUser = useSelector(onlyUserSelector)

    return {selectedTokens, onlyUser}
}

export default usePortfolio
import { useSelector } from 'react-redux'
import { portfolioTokensSelector, onlyUserSelector } from '../store/slices/portfolioSlice'

function usePortfolio() {
    const portfolioTokens = useSelector(portfolioTokensSelector)
    const onlyUser = useSelector(onlyUserSelector)

    return {portfolioTokens, onlyUser}
}

export default usePortfolio
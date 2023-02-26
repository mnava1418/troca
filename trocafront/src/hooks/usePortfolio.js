import { useSelector } from 'react-redux'
import { portfolioTokensSelector, onlyUserSelector, usersSelector } from '../store/slices/portfolioSlice'

function usePortfolio() {
    const selectedTokens = useSelector(portfolioTokensSelector)
    const onlyUser = useSelector(onlyUserSelector)
    const allUsers = useSelector(usersSelector)

    return {selectedTokens, onlyUser, allUsers}
}

export default usePortfolio
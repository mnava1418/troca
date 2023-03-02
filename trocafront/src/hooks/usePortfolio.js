import { useSelector } from 'react-redux'
import { 
    portfolioTokensSelector, 
    onlyUserSelector, 
    usersSelector,
    allTokensSelector
} from '../store/slices/portfolioSlice'

function usePortfolio() {
    const selectedTokens = useSelector(portfolioTokensSelector)
    const onlyUser = useSelector(onlyUserSelector)
    const allUsers = useSelector(usersSelector)
    const allTokens = useSelector(allTokensSelector)

    return {selectedTokens, onlyUser, allUsers, allTokens}
}

export default usePortfolio
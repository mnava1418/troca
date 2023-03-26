import { useState } from 'react'

function useNFTActions() {
    const [showDetails, setShowDetails] = useState(false)

    return {
        showDetails, setShowDetails
    }
}

export default useNFTActions
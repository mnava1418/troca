import {useEffect} from 'react'
import { useSelector } from 'react-redux'

import { connectionStatusSelector } from '../store/slices/statusSlice';
import { PATHS } from '../config';

function Auctions() {
    const { isConnected, isMember } = useSelector(connectionStatusSelector)  

    useEffect(() => {
        if(!isConnected) {
            window.location.href = PATHS.wallet
        } else if(!isMember) {
            window.location.href = PATHS.main
        } else {
            console.log('auction')
        }

        // eslint-disable-next-line
    }, [isConnected, isMember])

    return(
        <h1>Auctions</h1>
    )
}

export default Auctions
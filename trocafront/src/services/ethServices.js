export const isMetamaskAvailable = () => {
    const { ethereum } = window

    if(ethereum && ethereum.isMetaMask) {
        return true
    } else {
        return false
    }
}

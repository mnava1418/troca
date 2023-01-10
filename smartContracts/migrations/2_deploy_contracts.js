const NFT = artifacts.require("NFT");
const Troca = artifacts.require("Troca")

module.exports = async (deployer) => {
    await deployer.deploy(NFT)

    const accounts = await web3.eth.getAccounts()
    const ownerAccount = accounts[0]
    
    await deployer.deploy(Troca, ownerAccount)
}

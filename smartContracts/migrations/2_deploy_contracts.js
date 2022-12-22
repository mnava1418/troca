const NFT = artifacts.require("NFT");

module.exports = (deployer) => {
    deployer.deploy(NFT)
}
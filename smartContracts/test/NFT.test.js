const web3 = require('web3')
const NFT = artifacts.require('NFT')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('NFT', ([deployer, user1]) => {
    let nft

    beforeEach(async() => {
        nft = await NFT.new() 
    })

    describe('deployment', () => {
        it('check contract name', async() => {
            const name = await nft.name()
            name.should.equal("Troca Club")
        })

        it('check contract symbol', async() => {
            const symbol = await nft.symbol()
            symbol.should.equal("TRC")
        })
    })

    describe('mint', () => {
        let result
        const tokenURI = "tokenURI"

        beforeEach(async () => {
            result = await nft.mint(user1, tokenURI, 500, {from: deployer})
        })

        it('deployer has 0 nft', async() => {
            const balance = await nft.balanceOf(deployer)
            balance.toString().should.equal('0')
        })

        it('user1 has 1 nft', async() => {
            const balance = await nft.balanceOf(user1)
            balance.toString().should.equal('1')
        })

        it('user1 is owner of token 1', async() => {
            const owner = await nft.ownerOf(1)
            owner.should.equal(user1)
        })

        it('validate tokenURI', async() => {
            const currentURI = await nft.tokenURI(1)
            currentURI.should.equal(tokenURI)
        })

        it('emit Transfer event', () => {
            const log = result.logs[0]
            const event = log.args

            log.event.should.equal('Transfer')
            event.to.should.equal(user1)
            event.tokenId.toString().should.equal("1")
        })

        describe('validate royalty info', () => {
            let royaltyInfo

            beforeEach(async() => {
                royaltyInfo = await nft.royaltyInfo(1, 100)
            })

            it('user1 will receive royalty', async() => {
                const receiver = royaltyInfo['0']
                receiver.should.equal(user1)
            })

            it('royalty is 5 percent', async() => {
                const percent = royaltyInfo['1']
                percent.toString().should.equal("5")
            })
        })
    })
})

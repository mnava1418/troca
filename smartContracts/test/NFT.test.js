const web3 = require('web3')
const NFT = artifacts.require('NFT')
const Troca = artifacts.require('Troca')

/*ERROR MESSAGES */
const ERROR_OWNER_MEMBER = "VM Exception while processing transaction: revert ___Owner must be a member.___"

const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('NFT', ([deployer, user1, user2]) => {
    let nft
    let troca

    beforeEach(async() => {
        nft = await NFT.new() 
        troca = await Troca.new(deployer)
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
        const tokenURI = "tokenURI"

        describe('success', () => {
            let result
            const fee = getTokens(1)

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: fee})
                result = await nft.mint(troca.address, tokenURI, 500, {from: user1})
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

        describe('failure', () => {
            it('user2 is not a member', async () => {
                await nft.mint(troca.address, tokenURI, 500, {from: user2}).should.be.rejectedWith(ERROR_OWNER_MEMBER)

                const balance = await nft.balanceOf(user2)
                balance.toString().should.equal('0')
            })    
        })
    })
})

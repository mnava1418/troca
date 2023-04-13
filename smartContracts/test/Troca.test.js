const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Troca = artifacts.require('Troca')
const NFT = artifacts.require('NFT')

/*ERROR MESSAGES */
const ERROR_FEE = "VM Exception while processing transaction: revert ___Membership fee is mandatory.___"
const ERROR_MEMBER = "VM Exception while processing transaction: revert ___You are already a member.___"

const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Troca', ([deployer, user1, user2]) => {
    let troca
    let nft

    beforeEach(async () => {
        troca = await Troca.new(deployer) 
        nft = await NFT.new() 
    })

    describe('deployment', () => {
        it('check owner account', async() => {
            const ownerAccount = await troca.ownerAccount()
            ownerAccount.should.equal(deployer)
        })

        it('owner is a member', async () => {
            const isMember = await troca.members(deployer)
            isMember.should.equal(true)
        })
    })

    describe('subscribe', () => {
        let result
        let initialDeployerBalance
        const fee = getTokens(1)

        beforeEach(async () => {
            initialDeployerBalance = await eth.getBalance(deployer)
            result = await troca.subscribe({from: user1, value: fee})
        })

        describe('success', async () => {
            it('user 1 paid the fee', async () => {
                const finalDeployerBalance = await eth.getBalance(deployer)
                const pnl = finalDeployerBalance - initialDeployerBalance
                pnl.toString().should.equal(fee.toString())
            })

            it('user 1 became a member', async () => {
                const isMember = await troca.members(user1)
                isMember.should.equal(true)
            })

            it('emit Subscription event', () => {
                const log = result.logs[0]
                const event = log.args

                log.event.should.equal('Subscription')
                event.newMember.should.equal(user1)
            })
        })

        describe('failure', () => {
            it('user 2 didnt pay the fee', async () => {
                await troca.subscribe({from: user2, value: 0}).should.be.rejectedWith(ERROR_FEE)
                
                const isMember = await troca.members(user2)
                isMember.should.equal(false)
            })

            it('user 1 is already a member', async () => {
                await troca.subscribe({from: user1, value: fee}).should.be.rejectedWith(ERROR_MEMBER)

                const isMember = await troca.members(user1)
                isMember.should.equal(true)
            })
        })
    })

    describe('buyToken', () => {
        const tokenURI = "tokenURI"

        describe('success', () => {
            let result
            let initialDeployerBalance
            let initialUser1Balance
            const fee = getTokens(1)

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: fee})
                await nft.mint(troca.address, tokenURI, 500, {from: user1})
                await nft.approve(troca.address, 1, {from: user1})

                initialDeployerBalance = await eth.getBalance(deployer)
                initialUser1Balance = await eth.getBalance(user1)
                result = await troca.buyToken(nft.address, user1, 1, {from: user2, value: getTokens(1)})
            })

            it('user1 has 0 nft', async() => {
                const balance = await nft.balanceOf(user1)
                balance.toString().should.equal('0')
            })
    
            it('user2 has 1 nft', async() => {
                const balance = await nft.balanceOf(user2)
                balance.toString().should.equal('1')
            })
    
            it('user2 is owner of token 1', async() => {
                const owner = await nft.ownerOf(1)
                owner.should.equal(user2)
            })

            it('deployer receives fee', async() => {
                const finalDeployerBalance = await eth.getBalance(deployer)
                const receivedFee = finalDeployerBalance - initialDeployerBalance
                receivedFee.toString().should.equal(getTokens(0.02).toString())
            })

            it('user1 receives payment', async() => {
                const finalUser1Balance = await eth.getBalance(user1)
                const payment = finalUser1Balance - initialUser1Balance
                payment.toString().should.equal(getTokens(0.98).toString())
            })
    
            it('emit BuyToken event', () => {
                const log = result.logs[0]
                const event = log.args
    
                log.event.should.equal('BuyToken')
                event.buyer.should.equal(user2)
                event.seller.should.equal(user1)
                event.tokenId.toString().should.equal("1")
            })
        })
    })
})

const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Troca = artifacts.require('Troca')
const NFT = artifacts.require('NFT')

/*ERROR MESSAGES */
const ERROR_FEE = "VM Exception while processing transaction: revert ___Membership fee is mandatory.___"
const ERROR_MEMBER = "VM Exception while processing transaction: revert ___You are already a member.___"
const ERROR_NOT_APPORVED = "VM Exception while processing transaction: revert ERC721: caller is not token owner or approved"
const ERROR_INVALID_TOKEN = "VM Exception while processing transaction: revert ___Token id is mandatory.___"
const ERROR_INVALID_SELLER = "VM Exception while processing transaction: revert ___Seller Token Id is mandatory.___"
const ERROR_INVALID_BUYER = "VM Exception while processing transaction: revert ___Buyer Token Id is mandatory.___"

const getTokens = (tokens) => {
    return new web3.utils.BN(
        web3.utils.toWei(tokens.toString(), 'ether')
    )
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Troca', ([deployer, user1, user2, user3]) => {
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
            const memberFee = getTokens(1)
            let initialDeployerBalance

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: memberFee})
                await nft.mint(troca.address, tokenURI, {from: user1})
                await nft.approve(troca.address, 1, {from: user1})     
            })

            describe('member sells token', () => {                
                let initialUser1Balance            
                let result                            
                
                beforeEach(async () => {
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
    
                it('fee does not apply to members', async() => {     
                    const finalDeployerBalance = await eth.getBalance(deployer)
                    finalDeployerBalance.toString().should.equal(initialDeployerBalance.toString())
                })

                it('user1 receives payment - no fee applied', async() => {
                    const finalUser1Balance = await eth.getBalance(user1)
                    const payment = finalUser1Balance - initialUser1Balance
                    payment.toString().should.equal(getTokens(1).toString())
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

            describe('no member sells token', () => {
                let initialUser2Balance            

                beforeEach(async () => {                    
                    await troca.buyToken(nft.address, user1, 1, {from: user2, value: getTokens(1)})
                    await nft.approve(troca.address, 1, {from: user2})

                    initialDeployerBalance = await eth.getBalance(deployer)
                    initialUser2Balance = await eth.getBalance(user2)

                    await troca.buyToken(nft.address, user2, 1, {from: user3, value: getTokens(1)})
                })

                it('user1 has 0 nft', async() => {
                    const balance = await nft.balanceOf(user1)
                    balance.toString().should.equal('0')
                })
        
                it('user2 has 0 nft', async() => {
                    const balance = await nft.balanceOf(user2)
                    balance.toString().should.equal('0')
                })

                it('user3 has 1 nft', async() => {
                    const balance = await nft.balanceOf(user3)
                    balance.toString().should.equal('1')
                })

                it('user3 is owner of token 1', async() => {
                    const owner = await nft.ownerOf(1)
                    owner.should.equal(user3)
                })

                it('deployer receives fee from no members', async() => {  
                    const finalDeployerBalance = await eth.getBalance(deployer)
                    const receivedFee = finalDeployerBalance - initialDeployerBalance
                    receivedFee.toString().should.equal(getTokens(0.02).toString())
                })

                it('user2 receives payment - fee applied', async() => {
                    const finalUser2Balance = await eth.getBalance(user2)
                    const payment = finalUser2Balance - initialUser2Balance
                    payment.toString().should.equal(getTokens(0.98).toString())
                })
            })
        })

        describe('failure', () => {
            const fee = getTokens(1)

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: fee})
                await nft.mint(troca.address, tokenURI, {from: user1})
            })
            
            it('invalid token id', async() => {
                await troca.buyToken(nft.address, user1, 0, {from: user2, value: getTokens(1)}).should.be.rejectedWith(ERROR_INVALID_TOKEN)
            })

            it('token not approved', async() => {
                await troca.buyToken(nft.address, user1, 1, {from: user2, value: getTokens(1)}).should.be.rejectedWith(ERROR_NOT_APPORVED)
            })
        })
    })

    describe('switchToken', () => {
        const tokenURI = "tokenURI"

        describe('success', () => {
            const fee = getTokens(0.01)

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: fee}) //user 1 is a member
                await troca.subscribe({from: user2, value: fee}) //user 2 is a member
                
                await nft.mint(troca.address, tokenURI, {from: user1}) //user 1 owns token 1
                await nft.mint(troca.address, tokenURI, {from: user2}) //user 2 owns token 2

                await nft.approve(troca.address, 1, {from: user1}) //user 1 approved Troca to spend token
                await nft.approve(troca.address, 2, {from: user2}) //user 2 approved Troca to spend token
            })
    
            it('user1 is owner of token 1', async() => {
                const owner = await nft.ownerOf(1)
                owner.should.equal(user1)
            })

            it('user2 is owner of token 2', async() => {
                const owner = await nft.ownerOf(2)
                owner.should.equal(user2)
            })

            describe('users will switch tokens with no payment', () => {
                let result
                let initialDeployerBalance
                let initialUser1Balance

                beforeEach(async() => {
                    initialDeployerBalance = await eth.getBalance(deployer)
                    initialUser1Balance = await eth.getBalance(user1)
                    result = await troca.switchToken (nft.address, user1, 1, 2, {from: user2})
                })

                it('user1 is owner of token 2', async() => {
                    const owner = await nft.ownerOf(2)
                    owner.should.equal(user1)
                })
    
                it('user2 is owner of token 1', async() => {
                    const owner = await nft.ownerOf(1)
                    owner.should.equal(user2)
                })

                it('no fee for deployer', async() => {
                    const finalDeployerBalance = await eth.getBalance(deployer)
                    finalDeployerBalance.toString().should.equal(initialDeployerBalance)
                }) 

                it('no payment for user1', async() => {
                    const finallUser1Balance = await eth.getBalance(user1)
                    finallUser1Balance.toString().should.equal(initialUser1Balance)
                }) 

                it('emit SwitchToken event', () => {
                    const log = result.logs[0]
                    const event = log.args
        
                    log.event.should.equal('SwitchToken')
                    event.buyer.should.equal(user2)
                    event.seller.should.equal(user1)
                    event.sellerTokenId.toString().should.equal("1")
                    event.buyerTokenId.toString().should.equal("2")
                })
            })

            describe('users will switch tokens with payment', () => {
                let result
                let initialDeployerBalance
                let initialUser1Balance

                beforeEach(async() => {
                    initialDeployerBalance = await eth.getBalance(deployer)
                    initialUser1Balance = await eth.getBalance(user1)
                    result = await troca.switchToken (nft.address, user1, 1, 2, {from: user2, value: getTokens(0.01)})
                })

                it('user1 is owner of token 2', async() => {
                    const owner = await nft.ownerOf(2)
                    owner.should.equal(user1)
                })
    
                it('user2 is owner of token 1', async() => {
                    const owner = await nft.ownerOf(1)
                    owner.should.equal(user2)
                })

                it('fee does not apply to members', async() => {
                    const finalDeployerBalance = await eth.getBalance(deployer)                    
                    finalDeployerBalance.toString().should.equal(initialDeployerBalance.toString())
                }) 

                it('payment for user1', async() => {
                    const finallUser1Balance = await eth.getBalance(user1)
                    const payment = finallUser1Balance - initialUser1Balance
                    payment.toString().should.equal(getTokens(0.01).toString())
                }) 

                it('emit SwitchToken event', () => {
                    const log = result.logs[0]
                    const event = log.args
        
                    log.event.should.equal('SwitchToken')
                    event.buyer.should.equal(user2)
                    event.seller.should.equal(user1)
                    event.sellerTokenId.toString().should.equal("1")
                    event.buyerTokenId.toString().should.equal("2")
                })
            })
        })

        describe('failure', () => {

            const fee = getTokens(1)

            beforeEach(async () => {
                await troca.subscribe({from: user1, value: fee}) //user 1 is a member
                await troca.subscribe({from: user2, value: fee}) //user 2 is a member
                
                await nft.mint(troca.address, tokenURI, {from: user1}) //user 1 owns token 1
                await nft.mint(troca.address, tokenURI, {from: user2}) //user 2 owns token 2
            })
            
            it('invalid seller token id', async() => {
                await troca.switchToken (nft.address, user1, 0, 0, {from: user2}).should.be.rejectedWith(ERROR_INVALID_SELLER)
            })

            it('invalid buyer token id', async() => {
                await troca.switchToken (nft.address, user1, 1, 0, {from: user2}).should.be.rejectedWith(ERROR_INVALID_BUYER)
            })

            it('tokens not approved', async() => {
                await troca.switchToken (nft.address, user1, 1, 2, {from: user2}).should.be.rejectedWith(ERROR_NOT_APPORVED)
            })
        })
    })
})

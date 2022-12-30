const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Troca = artifacts.require('Troca')

/*ERROR MESSAGES */
const ERROR_FEE = "VM Exception while processing transaction: revert Membership fee is mandatory"
const ERROR_MEMBER = "VM Exception while processing transaction: revert You are already a member"

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

    beforeEach(async () => {
        troca = await Troca.new(deployer) 
    })

    describe('deployment', () => {
        it('check owner account', async() => {
            const ownerAccount = await troca.ownerAccount()
            ownerAccount.should.equal(deployer)
        })

        it('members should be empty', async () => {
            const isMember = await troca.members(deployer)
            isMember.should.equal(false)
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
})

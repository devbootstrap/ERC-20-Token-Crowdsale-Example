const GLDToken = artifacts.require("GLDToken");
const truffleAssert = require('truffle-assertions');
const BN = web3.utils.BN;

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('GLDToken', (accounts) => {
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    let creatorAddress = accounts[0];
    let firstOwnerAddress = accounts[1];
    let secondOwnerAddress = accounts[2];
    let externalAddress = accounts[3];
    let unprivilegedAddress = accounts[4]
    let instance
    const _symbol = 'GLD'
    const _name = 'Gold'
    const _supply = new BN('100000')

     beforeEach(async () => {
        instance = await GLDToken.deployed()
    })

    describe('token name, symbol and total supply metadata', () => {
        it('name() should return the token name', async () => {
            let name = await instance.name();
            name.should.equal(_name)
        })
        it('symbol() should return the token symbol', async () => {
            let symbol = await instance.symbol();
            symbol.should.equal(_symbol)
        })
        it('should have a totalsupply as expected', async ()=>{
            let ts = await instance.totalSupply()
            ts.should.be.a.bignumber.that.equals(_supply);
        })
    })

    describe('deployers balance', () => {
        it('should have the balance of the tokens in the deployer address', async () => {
            let bal = await instance.balanceOf(creatorAddress)
            assert.equal(bal.toString(), '100000', 'Creator did not receive tokens')
        })
    })

    describe('transfer to another address', () => {
        it('should update the other address balance', async () => {
            await instance.transfer(firstOwnerAddress, 300)
            let firstOwnerBal = await instance.balanceOf(firstOwnerAddress)
            let creatorBal = await instance.balanceOf(creatorAddress)
            assert.equal(firstOwnerBal.toString(), '300', 'First owner did not receive transfer')
            assert.equal(creatorBal.toString(), '99700', 'First owner did not receive transfer')
        })
        it('should emit a Transfer event', async () => {
            let res = await instance.transfer(firstOwnerAddress, 300)
            truffleAssert.eventEmitted(res, 'Transfer', (e) => {
                return  e.from == creatorAddress &&
                        e.to == firstOwnerAddress &&
                        e.value == 300
            })
        })
        it('should fail if the recipient address is a 0x0 address', async () => {
            await truffleAssert.reverts(
                instance.transfer(emptyAddress, 300),
                "ERC20: transfer to the zero address"
            );
        })
    })

    describe('Mintable', () => {
        it('should be possible for a designated minter to mint tokens', async () => {
            let res = await instance.mint(creatorAddress, 1000)
            let bal = await instance.balanceOf(creatorAddress)
            assert.equal(bal.toString(), '100400', 'Unable to mint new tokens')
        })
        it('should not be possible for a non minter role address to mint coins', async () => {
            await truffleAssert.reverts(
                instance.mint(firstOwnerAddress, 1000, {from: firstOwnerAddress}),
                "MinterRole: caller does not have the Minter role"
            )
        })
        it('should allow a new minter to mint the token', () => {
            // here the contract owner adds the firstOwner as a new minter
            instance.addMinter(firstOwnerAddress)
            // so that now they can mint all they like!
            instance.mint(firstOwnerAddress, 1000, {from: firstOwnerAddress})
        })
    })
});

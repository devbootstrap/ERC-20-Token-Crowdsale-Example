var GLDToken = artifacts.require("GLDToken");
const truffleAssert = require('truffle-assertions');

contract('GLDToken', (accounts) => {
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    var creatorAddress = accounts[0];
    var firstOwnerAddress = accounts[1];
    var secondOwnerAddress = accounts[2];
    var externalAddress = accounts[3];
    var unprivilegedAddress = accounts[4]
    let instance;

     beforeEach(async () => {
        instance = await GLDToken.deployed();
    })

    describe('token name, symbol and total supply metadata', () => {
        it('name() should return the token name', async () => {
            // let instance = await GLDToken.deployed();
            let name = await instance.name();
            assert.equal(name, 'Gold')
        })
        it('symbol() should return the token symbol', async () => {
            // let instance = await GLDToken.deployed();
            let symbol = await instance.symbol();
            assert.equal(symbol, 'GLD')
        })
        it('should have a totalsupply as expected', async ()=>{
            let ts = await instance.totalSupply()
            assert.equal(ts.toString(), '100000', 'Unexpected Total Supply')
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
    })
});

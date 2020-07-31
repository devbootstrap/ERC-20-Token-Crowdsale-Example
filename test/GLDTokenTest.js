var GLDToken = artifacts.require("GLDToken");

contract('GLDToken', (accounts) => {
    var creatorAddress = accounts[0];
    var firstOwnerAddress = accounts[1];
    var secondOwnerAddress = accounts[2];
    var externalAddress = accounts[3];
    var unprivilegedAddress = accounts[4]
    let instance;

     beforeEach(async () => {
        instance = await GLDToken.deployed();
    })

    describe('token name and symbol metadata', () => {
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
    })
});

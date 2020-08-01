const GLDToken = artifacts.require("GLDToken");
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

require('chai')
  .use(require('chai-bn')(BN))
  .should();

const {
    shouldBehaveLikeERC20,
} = require('./ERC20.behavior');


contract('GLDToken', (accounts) => {
    let creatorAddress = accounts[0];
    let firstOwnerAddress = accounts[1];
    let secondOwnerAddress = accounts[2];
    let externalAddress = accounts[3];
    let unprivilegedAddress = accounts[4]
    let instance
    const _symbol = 'GLD'
    const _name = 'Gold'
    const _supply = new BN(100000)
    const _decimals = new BN(18)

    describe('ERC20 Token Behaviour', () => {
        beforeEach(async function () {
            this.token = await GLDToken.new(_supply)
        })

        shouldBehaveLikeERC20('ERC20', _supply, creatorAddress, firstOwnerAddress, unprivilegedAddress);
    })


    beforeEach(async () => {
        token = await GLDToken.deployed()
    })

    describe('token name, symbol and total supply metadata', () => {
        it('name() should return the token name', async () => {
            let name = await token.name();
            name.should.equal(_name)
        })
        it('symbol() should return the token symbol', async () => {
            let symbol = await token.symbol();
            symbol.should.equal(_symbol)
        })
        it('has an amount of decimals', async function () {
            let decimals = await token.decimals()
            decimals.should.be.a.bignumber.that.equals(_decimals);
        });
    })

    describe('deployers balance', () => {
        it('should have the balance of the tokens in the deployer address', async () => {
            let bal = await token.balanceOf(creatorAddress)
            assert.equal(bal.toString(), '100000', 'Creator did not receive tokens')
        })
    })

    describe('transfer to another address', () => {
        it('should update the other address balance', async () => {
            await token.transfer(firstOwnerAddress, 300)
            let firstOwnerBal = await token.balanceOf(firstOwnerAddress)
            let creatorBal = await token.balanceOf(creatorAddress)
            assert.equal(firstOwnerBal.toString(), '300', 'First owner did not receive transfer')
            assert.equal(creatorBal.toString(), '99700', 'First owner did not receive transfer')
        })
        it('should emit a Transfer event', async () => {
            let res = await token.transfer(firstOwnerAddress, 300)
            expectEvent(res, 'Transfer', (e) => {
                return  e.from == creatorAddress &&
                        e.to == firstOwnerAddress &&
                        e.value == 300
            })
        })
        it('should fail if the recipient address is a 0x0 address', async () => {
            await expectRevert(
                token.transfer(ZERO_ADDRESS, 300),
                "ERC20: transfer to the zero address"
            );
        })
    })

    describe('Mintable', () => {
        it('should be possible for a designated minter to mint tokens', async () => {
            let res = await token.mint(creatorAddress, 1000)
            let bal = await token.balanceOf(creatorAddress)
            assert.equal(bal.toString(), '100400', 'Unable to mint new tokens')
        })
        it('should not be possible for a non minter role address to mint coins', async () => {
            await expectRevert(
                token.mint(firstOwnerAddress, 1000, {from: firstOwnerAddress}),
                "MinterRole: caller does not have the Minter role"
            );
        })
        it('should allow a new minter to mint the token', () => {
            // here the contract owner adds the firstOwner as a new minter
            token.addMinter(firstOwnerAddress)
            // so that now they can mint all they like!
            token.mint(firstOwnerAddress, 1000, {from: firstOwnerAddress})
        })
    })
});

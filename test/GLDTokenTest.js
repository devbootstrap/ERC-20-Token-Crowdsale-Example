const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { shouldBehaveLikeERC20 } = require('./behaviors/ERC20.behavior');
const { shouldBehaveLikeERC20Mintable } = require('./behaviors/ERC20Mintable.behavior');
// Import the GLD Token artifacts
const GLDToken = artifacts.require("GLDToken");

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('GLDToken', (accounts) => {
    let creatorAddress = accounts[0];
    let firstOwnerAddress = accounts[1];
    let secondOwnerAddress = accounts[2];
    let externalAddress = accounts[3];
    let unprivilegedAddress = accounts[4]
    const _symbol = 'GLD'
    const _name = 'Gold'
    const _supply = new BN(100000)
    const _decimals = new BN(18)

    describe('ERC20 Standard Token Behaviour', () => {
        // Note must use startard function definition to be able to use `this.token`
        // so that it is defined adn available in the `shouldBehaveLikeERC20` function call
        beforeEach(async function () {
            this.token = await GLDToken.new(_supply)
        })

        shouldBehaveLikeERC20('ERC20', _supply, creatorAddress, firstOwnerAddress, unprivilegedAddress);

        describe('ERC20 Mintable Behaviour', () => {
            shouldBehaveLikeERC20Mintable(creatorAddress, [firstOwnerAddress])
        })
    })

    describe('GLD Token Behaviour', () => {
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
    })
});

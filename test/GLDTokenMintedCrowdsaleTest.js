/*
  *
  * Tests cases brought in and slightly modified from OpenZeppelin test repo here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/test/crowdsale/MintedCrowdsale.test.js
  *
  *
*/

const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, ether } = require('@openzeppelin/test-helpers');
const { shouldBehaveLikeMintedCrowdsale } = require('./behaviors/MintedCrowdsale.behavior');

const { expect } = require('chai');

const MintedCrowdsaleImpl = contract.fromArtifact('GLDTokenCrowdsale');
const ERC20Mintable = contract.fromArtifact('GLDToken');
const cap = ether('10');

describe('MintedCrowdsale', function () {
  const [ deployer, investor, wallet, purchaser ] = accounts;

  const rate = new BN('1000');
  const value = ether('5');
  const _supply = new BN(100000)

  describe('using ERC20Mintable', function () {
    beforeEach(async function () {
      this.token = await ERC20Mintable.new(_supply, { from: deployer });
      this.crowdsale = await MintedCrowdsaleImpl.new(rate, wallet, this.token.address, cap);

      await this.token.addMinter(this.crowdsale.address, { from: deployer });
      await this.token.renounceMinter({ from: deployer });
    });

    it('crowdsale should be minter', async function () {
      expect(await this.token.isMinter(this.crowdsale.address)).to.equal(true);
    });

    shouldBehaveLikeMintedCrowdsale([investor, wallet, purchaser], rate, value);
  });
});
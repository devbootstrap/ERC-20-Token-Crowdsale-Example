/*
  *
  * Tests cases brought in from OpenZeppelin test repo here: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.5.0/test/crowdsale/CappedCrowdsale.test.js
  *
  *
*/
const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, ether, expectRevert, time } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const CappedCrowdsaleImpl = contract.fromArtifact('GLDTokenCrowdsale');
const SimpleToken = contract.fromArtifact('GLDToken');

describe('CappedCrowdsale', function () {
  const [ wallet ] = accounts;

  const rate = new BN('1');
  const cap = ether('10');
  const lessThanCap = ether('2');
  const tokenSupply = new BN('10').pow(new BN('22'));

  beforeEach(async function () {
    this.openingTime = await time.latest()
    this.closingTime = this.openingTime.add(time.duration.days(1))
    this.token = await SimpleToken.new(tokenSupply);
  });

  it('rejects a cap of zero', async function () {
    await expectRevert(CappedCrowdsaleImpl.new(rate, wallet, this.token.address, 0, this.openingTime, this.closingTime),
      'CappedCrowdsale: cap is 0'
    );
  });

  context('with crowdsale', function () {
    beforeEach(async function () {
      this.openingTime = await time.latest()
      this.closingTime = this.openingTime.add(time.duration.days(1))
      this.crowdsale = await CappedCrowdsaleImpl.new(rate, wallet, this.token.address, cap, this.openingTime, this.closingTime);
      await this.token.transfer(this.crowdsale.address, tokenSupply);
      await this.token.addMinter(this.crowdsale.address);
    });

    describe('accepting payments', function () {
      it('should accept payments within cap', async function () {
        await this.crowdsale.send(cap.sub(lessThanCap));
        await this.crowdsale.send(lessThanCap);
      });

      it('should reject payments outside cap', async function () {
        await this.crowdsale.send(cap);
        await expectRevert(this.crowdsale.send(1), 'CappedCrowdsale: cap exceeded');
      });

      it('should reject payments that exceed cap', async function () {
        await expectRevert(this.crowdsale.send(cap.addn(1)), 'CappedCrowdsale: cap exceeded');
      });
    });

    describe('ending', function () {
      it('should not reach cap if sent under cap', async function () {
        await this.crowdsale.send(lessThanCap);
        expect(await this.crowdsale.capReached()).to.equal(false);
      });

      it('should not reach cap if sent just under cap', async function () {
        await this.crowdsale.send(cap.subn(1));
        expect(await this.crowdsale.capReached()).to.equal(false);
      });

      it('should reach cap if cap sent', async function () {
        await this.crowdsale.send(cap);
        expect(await this.crowdsale.capReached()).to.equal(true);
      });
    });
  });
});
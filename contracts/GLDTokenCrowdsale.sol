pragma solidity >= 0.5.0 < 0.7.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
Rate Examples

Example from https://docs.openzeppelin.com/contracts/2.x/crowdsales

Rate calc for 1 TKN for every dollar (USD) in Ether:

Lets assume 1 ETH == $400
therefore, 1e18 wei = $400
therefore, 1 USD is 1e18 / 400, or 2.5e15 wei (becuase 1 / 4 = 0.25 and 1 / 400 = 0.0025 so 1e18 / 400 = 0.0025e18)
we have a decimals of 18, so we’ll use 1e18 TKNbits instead of 1 TKN
therefore, if the participant sends the crowdsale 2.5e15 wei ($1 USD) we return 1e18 TKNbits
therefore the rate is 2.5e15 wei === 1e18 TKNbits, or 1 wei = 400 TKNbits (since we divide both sides of equation by the amount of wei to get 1 wei === (1e18 / 2.5e15))
therefore, our rate is 400
 */

contract GLDTokenCrowdsale is Crowdsale {
  constructor(uint256 _rate,
              address payable _wallet,
              IERC20 _token)
  Crowdsale(_rate, _wallet, _token)
  public
  {

  }
}

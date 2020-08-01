pragma solidity >= 0.5.0 < 0.7.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GLDTokenCrowdsale is Crowdsale, CappedCrowdsale {
  constructor(uint256 _rate,
              address payable _wallet,
              IERC20 _token,
              uint256 _cap)
  Crowdsale(_rate, _wallet, _token)
  CappedCrowdsale(_cap)
  public
  {

  }
}

pragma solidity >= 0.5.0 < 0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract GLDToken is ERC20, ERC20Detailed, ERC20Mintable {
    constructor(uint256 initialSupply) ERC20Detailed("Gold", "GLD", 18) public {
        _mint(msg.sender, initialSupply);
    }
}
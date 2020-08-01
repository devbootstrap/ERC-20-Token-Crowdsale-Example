# Example ERC-20 Token and Crowdsale Smart Contract using OpenZeppelin 2x

## Test run the Smart Contracts!

To test run these Smart Contracts you will need to have truffle installed and then in a new terminal window start up `Ganache`:

```
ganache-cli
```

Then in a *new terminal window* run these `truffle` commands:

```
truffle compile
truffle migrate --reset
truffle test
```

## A note on setting crowdfund rate

Example from https://docs.openzeppelin.com/contracts/2.x/crowdsales

**Rate calc for 1 TKN for every dollar (USD) in Ether:**

* Lets assume 1 ETH == $400
* therefore, 1e18 wei = $400
* therefore, 1 USD is 1e18 / 400, or 2.5e15 wei (becuase 1 / 4 = 0.25 and 1 / 400 = 0.0025 so 1e18 / 400 = 0.0025e18)
* we have a decimals of 18, so we’ll use 1e18 TKNbits instead of 1 TKN
* therefore, if the participant sends the crowdsale 2.5e15 wei ($1 USD) we return 1e18 TKNbits
* therefore the rate is 2.5e15 wei === 1e18 TKNbits, or 1 wei = 400 TKNbits (since we divide both sides of equation by the amount of wei to get 1 wei === (1e18 / 2.5e15))
* therefore, our rate is 400

**Another example 1 ETH = 700 TKN**

1 ETH = 700 TKN
1 TKN = 0.00142857 ETH (1428570000000000 Wei)
1 TKN = 0.00142857 ETH
1e18 TKNBits = 1428570000000000 Wei
Rate = 1e18 / 1428570000000000 = 700.0007000007
Rate = 700 (1 Wei = 700 TKNBits)

## A note on setting crowdfund cap

Imagine that the cap if TKN is 125e6 (125,000,000).

Based on a price of 1 ETH = 700 TKN (see above rate example) then to calculate the cap in wei we would:

Cap: 	125e6 TKN
		  125e6 / 700 = 178571.42857142858 ETH
					        = 1.7857142857142857e+23 wei
					        = 178571428571428580000000 wei

## Libraries used / tested against

* Truffle v5.1.14-nodeLTS.0 (core: 5.1.13)
* Solidity v0.5.16 (solc-js)
* Node v12.18.1
* Web3.js v1.2.1
* @openzeppelin/contracts@2.5.1
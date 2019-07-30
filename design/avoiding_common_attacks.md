# Avoiding Common Attacks

## Reentrancy

The reentrancy attack is prevented on the contracts through updating the variables before any relevant action is performed. For example:

```
    function withdrawDividends() external {
        require(!receivedDividends[msg.sender][payoutIndex],
        "User already withdrew dividends this period");
        require(payoutInSession, "It is not a payout period yet");
        receivedDividends[msg.sender][payoutIndex] = true;
        uint balance = token.balanceOf(msg.sender);
        uint dividendsAllocated = currentPool.mul(balance)/tokenSupply;
        leftInCurrentPool = leftInCurrentPool.sub(dividendsAllocated);
        msg.sender.transfer(dividendsAllocated);
    }
```

The function above, taken from *FeePool.sol*, in order to prevent a user from withdrawing dividends twice, performs all relevant updates to the state before actually sending the Ether to the `msg.sender`.

## Overflow/Undeflow

To ensure that relevant mathematical operations do not cause overflows or underflows, the library *SafeMath* is utilized for mathematical operations. This is especially relevant for the *CertfyToken* and *FeePool* contracts. Example:

```
    function _move(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    )
        private
    {
        _balances[from] = _balances[from].sub(amount);
        _balances[to] = _balances[to].add(amount);

        emit Sent(operator, from, to, amount, userData, operatorData);
        emit Transfer(from, to, amount);
    }
```

*Code taken from CertfyToken.sol*


## Timestamp dependence

Certain aspects of the project require the consideration of time as a factor. However, large time frames are utilized to prevent miners/validators from being able to perform unwanted actions by influencing the `block.timestamp`. Time restrictions in *FeePool*, for example, are used in the context of days, not seconds.

## Denial of Service (Gas Limit)

In order to both optimize for gas and prevent DoS attacks, a limited amount of loops is used troughout the whole application. These loops also never call functions outside of the contract or transfer ETH, preventing other malicious contracts from draining the gas available.









pragma solidity^0.5.0;

import "../lib/math/SafeMath.sol";

contract CertfyToken {

    function balanceOf(address tokenHolder) public view returns (uint256) {}
    function pauseTransfers() public {}

}

contract FeePool {

    CertfyToken public token;

    using SafeMath for uint256;

    uint public currentPool;
    uint public leftInCurrentPool;
    uint public nextPool;

    // Values in reality are '2 days' and '30 days', respectively
    // Lower values for test purposes
    uint constant payoutPeriod = 0;
    uint constant dividendPayoutInterval = 1;

    uint payoutIndex;
    uint lastPayout;
    uint payoutStart;
    bool public payoutInSession;

    uint public tokenSupply;

    bool tokenSet = false;

    mapping(address => mapping(uint => bool)) receivedDividends;

    constructor() public {
        lastPayout = block.timestamp;
    }

    function setToken(address _token, uint _tokenSupply) public {
        require(!tokenSet);
        tokenSet = true;
        token = CertfyToken(_token);
        tokenSupply = _tokenSupply;
    }

    function () external payable {
        if (payoutInSession) {
            nextPool += msg.value;
        }
        else {
            currentPool += msg.value;
        }
    }

    function activatePayout() external {
        require(lastPayout + block.timestamp > dividendPayoutInterval,
        "It is not time for Payout Period yet");
        payoutInSession = true;
        payoutStart = block.timestamp;
        leftInCurrentPool = currentPool;
        // token.pauseTransfers();
    }

    function endPayoutPeriod() external {
        /*
        require(payoutInSession && (block.timestamp - payoutStart) > payoutPeriod,
        "Not ready to leave payout period yet");
        */
        payoutInSession = false;
        lastPayout = block.timestamp;
        payoutStart = 0;
        currentPool = leftInCurrentPool.add(nextPool);
        nextPool = 0;
        leftInCurrentPool = 0;
        payoutIndex++;
        // token.pauseTransfers();
    }

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

    function nextPayoutPeriod() external view returns(uint) {
        return (lastPayout + dividendPayoutInterval - block.timestamp);
    }


}
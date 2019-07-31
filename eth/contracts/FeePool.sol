pragma solidity^0.5.0;

import "../lib/math/SafeMath.sol";

/** 
 * @title Fee Pool
 * @author Yakko Majuri
 * @notice An ETH pool which receives funds (fees) from the DocumentRegistration contract and distributes to token holders via dividends
*/


contract CertfyToken {

    function balanceOf(address tokenHolder) public view returns (uint256) {}
    function pauseTransfers() public {}

}

contract FeePool {

    // ERC777 token contract address
    CertfyToken public token;

    // Prevent overflow/underflow
    using SafeMath for uint256;

    // Establishes the size of the different pools
    uint public currentPool;
    uint public leftInCurrentPool;

    // For funds deposited during a dividend payout period
    uint public nextPool;

    // Values in reality are '2 days' and '30 days', respectively
    // Lower values for test purposes
    uint constant payoutPeriod = 0;
    uint constant dividendPayoutInterval = 1;

    // Number of the current payout
    uint payoutIndex;

    // Coordinate payout time constraints
    uint lastPayout;
    uint payoutStart;
    bool public payoutInSession;

    // Total supply needed to determine the share of supply ownerd by each token holder
    uint public tokenSupply;

    // For contract initialization
    bool tokenSet = false;

    // Double mapping which ensure a user does not receive dividends twice for a given period
    mapping(address => mapping(uint => bool)) receivedDividends;


    constructor() public {
        lastPayout = block.timestamp;
    }

    /** 
     * @notice Fallback function adds funds to the pool once they are received
     * @dev Rolls funds over to the pool of the next period if they are deposited during a dividend payout
     * This happens because some users may have already taken dividends out before more funds are added
    */
    function () external payable {}

    /** 
     * @notice 'Switch' to activate dividend payout period
     * @dev Deliberately left open for any address to call
     * This prevents over-reliance on a centralizing agent to activate a payout
     * If the conditions are met (regarding time), anyone can activate a payout
    */
    function activatePayout() external {
        require(block.timestamp > (lastPayout + dividendPayoutInterval),
        "It is not time for Payout Period yet");
        require(!payoutInSession,
        "payout already happening");
        payoutInSession = true;
        payoutStart = block.timestamp;
        leftInCurrentPool = currentPool;
        // token.pauseTransfers();
    }

    /** 
     * @notice 'Switch' to end dividend payout period
     * @dev Deliberately left open for any address to call
     * This prevents over-reliance on a centralizing agent to end a payout
     * If the conditions are met (regarding time), anyone can end a payout period
     * Incentive to end the period is starting the countdown to the new payout with a fresh pool
     * @dev Dividends not collected roll over to the next period
    */
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

    /** 
     * @notice Allows users to withdraw their designated dividends for the period
     * @dev dividendsAllocated is computed by the percentage of all tokens owned by a user
     * multiplied by the total value of the pool in ETH
     * @dev Users can only collect dividends once per period
     * Dividends not collected will roll over to the pool of the next period
     * @dev Users have t = payoutPeriod to withdraw their dividends before the payout 
     * period can be closed and their dividends roll over
    */
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

    /** 
     * @notice Sets the CertfyToken contract address - Used for initialization
    */
    function setToken(address _token, uint _tokenSupply) public {
        require(!tokenSet);
        tokenSet = true;
        token = CertfyToken(_token);
        tokenSupply = _tokenSupply;
    }

    /** 
     * @notice Informs users when the next payout period can begin
     * Can be used by a client to display a countdown
    */
    function nextPayoutPeriod() external view returns(uint) {
        return (lastPayout + dividendPayoutInterval - block.timestamp);
    }

    function incrementPool() public {
        if (payoutInSession) {
            nextPool += (address(this).balance - currentPool - nextPool);
        } else {
            currentPool += (address(this).balance - currentPool);
        }
    }
}
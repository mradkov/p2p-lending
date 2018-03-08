pragma solidity ^0.4.18;

import './common/SafeMath.sol';
import './common/Destructible.sol';
import './Credit.sol';

/** @title Peer to peer lending contract.
  * Inherits the Ownable and Destructible contracts.
  */
contract PeerToPeerLending is Destructible {
    /** @dev Usings */
    // Using SafeMath for our calculations with uints.
    using SafeMath for uint;

    /** @dev State variables */

    // User structure
    struct User {
        bool credited;
        address activeCredit;
        bool fraudStatus;
    }

    mapping(address => User) users;
    
    address[] public credits;

    /** @dev Events */
    event LogCreditCreated(address indexed _address, address indexed _borrower, uint indexed timestamp);

    /** @dev Modifiers */

    function PeerToPeerLending() public {

    }

    function applyForCredit(uint requestedAmount, uint repaymentsCount, bytes32 creditDescription) public returns(address _credit) {
        // The person should not have active credits;
        require(users[msg.sender].credited == false);
        require(users[msg.sender].fraudStatus == false);
        assert(users[msg.sender].activeCredit == 0);

        users[msg.sender].credited = true;
        Credit credit = new Credit(requestedAmount, repaymentsCount, creditDescription);
        users[msg.sender].activeCredit = credit;

        credits.push(credit);
        LogCreditCreated(credit, msg.sender, now);
        return credit;
    }

    function getCredits() public view returns(address[]) {
        return credits;
    }

    function setFraudStatus(address _borrower) external {
        users[_borrower].fraudStatus = true;
    }
}
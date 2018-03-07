pragma solidity ^0.4.18;

import './common/SafeMath.sol';
import './common/Ownable.sol';
import './common/Destructible.sol';
import './Credit.sol';

/** @title Peer to peer lending contract.
  * Inherits the Ownable and Destructible contracts.
  */
contract PeerToPeerLending is Ownable, Destructible {
    
    /** @dev Usings */
    // Using SafeMath for our calculations with uints.
    using SafeMath for uint;

    /** @dev State variables */

    // User structure
    struct User {
        bool credited;
        address activeCredit;
        mapping(address => uint) invested;
    }

    mapping(address => User) users;
    
    address[] public credits;

    /** @dev Events */
    event LogCreditCreated(address indexed _address, address indexed _borrower, uint indexed timestamp);

    /** @dev Modifiers */

    function PeerToPeerLending() public {

    }

    function applyForCredit(uint requestedAmount, uint repaymentsCount, bytes32 creditDescription) public returns(address) {
        // The person should not have active credits;
        require(users[msg.sender].credited == false);
        assert(users[msg.sender].activeCredit == 0);

        users[msg.sender].credited = true;
        Credit credit = new Credit(requestedAmount, repaymentsCount, creditDescription);
        users[msg.sender].activeCredit = credit;

        LogCreditCreated(credit, msg.sender, now);
        return credit;
    }
}
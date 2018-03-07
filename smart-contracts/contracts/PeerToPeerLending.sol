pragma solidity ^0.4.18;

import './common/SafeMath.sol';
import './common/Ownable.sol';
import './common/Destructible.sol';
import './Credit.sol';

contract PeerToPeerLending is Ownable, Destructible {

    using SafeMath for uint;

    struct User {
        bool credited;
        address activeCredit;
        mapping(address => uint) invested;
    }

    mapping(address => User) users;
    
    address[] public credits;

    event LogWithdraw(address indexed _address, uint indexed _amount, uint indexed _timestamp);
    event LogInvestInCredit(address indexed _address, uint indexed _amount, uint indexed _timestamp, address _credit);

    function PeerToPeerLending() public {

    }

    function applyForCredit(uint requestedAmount, uint repaymentsCount, bytes32 creditDescription) public returns(address) {
        // The person should not have active credits;
        require(users[msg.sender].credited == false);
        assert(users[msg.sender].activeCredit == 0);

        users[msg.sender].credited = true;
        Credit credit = new Credit(requestedAmount, repaymentsCount, creditDescription);
        users[msg.sender].activeCredit = credit;
        return credit;
    }
}
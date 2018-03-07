pragma solidity ^0.4.18;


library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        //there is no case where this function can overflow/underflow
        uint256 c = a / b;
        return c;
    }
    
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


contract Ownable {
    address owner;

    event LogOwnershipTransfered(address indexed _currentOwner, address indexed _newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Owned() internal {
        owner = msg.sender;
    }

    // @dev - The ownership shouldn't be transferrable. Otherwise it will mess up the members logic.
    /* function transferOwnership(address _newOwner) public onlyOwner {
         owner = _newOwner;
         LogOwnershipTransfered(msg.sender, _newOwner);
     } */
}


contract Destructible is Ownable {
    
    function Destructible() public payable { }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
    
    function destroyAndSend(address _recipient) public onlyOwner {
        selfdestruct(_recipient);
    }
}


contract Credit is Ownable, Destructible {
    using SafeMath for uint;

    address public borrower;
    uint public requestedAmount;
    uint public repaidAmount;

    uint public requestedRepayments;
    uint public remainingRepayments;
    
    uint public requestedDate;
    uint public lastRepaymentDate;
    
    uint public interest;
    string public description;
    bool public active;
    mapping(address => bool) public lenders;
    mapping(address => uint) public lendersInvestedAmount;

    modifier isActive() {
        require(active == true);
        _;
    }
    
    modifier onlyBorrower() {
        require(msg.sender == borrower);
        _;
    }
    
    modifier canWithdraw() {
        require(this.balance >= requestedAmount);
        _;
    }

    function remove() public onlyOwner {
        borrower = 0;
    }

    function Credit(address _borrower, uint _requestedAmount, uint _requestedRepayments, string _description) public {
        borrower = _borrower;
        requestedAmount = _requestedAmount;
        requestedRepayments = _requestedRepayments;
        remainingRepayments = _requestedRepayments;
        active = true;
        description = _description;
        requestedDate = now; 
    }
    
    function invest() public payable {
        require(this.balance < requestedAmount);
        uint extraMoney;
        if (msg.value + this.balance > requestedAmount) {
            extraMoney = requestedAmount - msg.value - this.balance;
            assert(requestedAmount == this.balance + msg.value - extraMoney);
            tx.origin.transfer(extraMoney);
        }
        
        lenders[tx.origin] = true;
        lendersInvestedAmount[tx.origin] = msg.value - extraMoney;
    }
    
    //repayment
    function repay() public onlyBorrower payable {
        remainingRepayments--;
        lastRepaymentDate = now;
        repaidAmount = repaidAmount.add(msg.value);
    }
    
    function withdraw(uint amount) public isActive onlyBorrower canWithdraw {
        require(this.balance >= amount);
        borrower.transfer(amount);
    }

}


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

    function applyForCredit(uint requestedAmount, uint repaymentsCount, string creditDescription) public returns(address) {
        // The person should not have active credits;
        require(users[msg.sender].credited == false);
        assert(users[msg.sender].activeCredit == 0);

        users[msg.sender].credited = true;
        Credit credit = new Credit(msg.sender, requestedAmount, repaymentsCount, creditDescription);
        users[msg.sender].activeCredit = credit;
        return credit;
    }

    function investInCredit(Credit credit) public payable {
        
        credit.invest();

        LogInvestInCredit(msg.sender, msg.value, now, credit);
    }


    // // Withdraw can only be done to the free amount of the lender,
    // // that is currently not borrowed.
    // function withdraw(uint _amount) public {
    //     // Check if free amount is enough.
    //     require(freeAmount[msg.sender] >= _amount);

    //     // The balance of the contract should have enough amount for the withdraw request.
    //     require(this.balance >= _amount);

    //     // Prevent reentrancy attack by decreasing the amount for lender's account
    //     freeAmount[msg.sender] -= _amount;

    //     // Transfer the requested amount.
    //     msg.sender.transfer(_amount);

    //     // Log the withdraw event.
    //     LogWithdraw(msg.sender, _amount, now);
    // }

}
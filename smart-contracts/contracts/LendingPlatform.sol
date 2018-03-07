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

    function Ownable() internal {
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
    uint public returnAmount;
    uint public repaidAmount;
    uint public interest;

    uint public requestedRepayments;
    uint public remainingRepayments;
    uint public repaymentStep;
    
    uint public requestedDate;
    uint public lastRepaymentDate;
    
    bytes32 public description;
    
    bool public active = true;
    enum State { investment, repayment, interestReturns }
    State state;

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
    
    modifier onlyLender() {
        require(lenders[msg.sender] == true);
        _;
    }
    
    modifier canAskForInterest(){
        require(state == State.interestReturns);
        require(lendersInvestedAmount[msg.sender] > 0);
        _;
    }
    
    modifier canInvest() {
        require(state == State.investment);
        _;
    }
    
    modifier canRepay() {
        require(state == State.repayment);
        _;
    }
    
    modifier canWithdraw() {
        require(this.balance >= requestedAmount);
        _;
    }

    function pause(bool _active) public onlyOwner {
        active = _active;
    }

    function Credit(uint _requestedAmount, uint _requestedRepayments, bytes32 _description) public {
        borrower = tx.origin;
        interest = 5000;
        requestedAmount = _requestedAmount;
        requestedRepayments = _requestedRepayments;
        remainingRepayments = _requestedRepayments;
        returnAmount = requestedAmount.add(interest);
        repaymentStep = returnAmount.div(requestedRepayments);

        description = _description;
        requestedDate = now;
    }
    
    function getBalance() public view returns(uint256) {
        return this.balance;
    }
    
    function invest() public canInvest payable {
        uint extraMoney = 0;
        if (this.balance >= requestedAmount) {
            extraMoney = this.balance.sub(requestedAmount);
            assert(requestedAmount == this.balance.sub(extraMoney));
            assert(extraMoney <= msg.value);
            tx.origin.transfer(extraMoney);
            state = State.repayment;
        }
        
        lenders[tx.origin] = true;
        lendersInvestedAmount[tx.origin] = lendersInvestedAmount[tx.origin].add(msg.value.sub(extraMoney));
        
    }
    
    //repayment
    function repay() public onlyBorrower canRepay payable {
        require(remainingRepayments > 0);
        require(msg.value >= repaymentStep);
        assert(repaidAmount < returnAmount);
        remainingRepayments--;
        lastRepaymentDate = now;
        uint extraMoney = 0;
        if (msg.value > repaymentStep) {
            extraMoney = msg.value.sub(repaymentStep);
            assert(repaymentStep == msg.value.sub(extraMoney));
            assert(extraMoney <= msg.value);
            tx.origin.transfer(extraMoney);
        }
        
        repaidAmount = repaidAmount.add(msg.value.sub(extraMoney));
        if (repaidAmount == returnAmount) {
            state = State.interestReturns;
        }
    }
    
    function withdraw() public isActive onlyBorrower canWithdraw {
        state = State.repayment;
        borrower.transfer(this.balance);
    }
    
    function requestInterest() public isActive onlyLender canAskForInterest {
        assert(this.balance >= lendersInvestedAmount[msg.sender]);
        uint returnInterest = returnAmount.div(lendersInvestedAmount[msg.sender]);
        msg.sender.transfer(lendersInvestedAmount[msg.sender].mul(returnInterest));
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

    function applyForCredit(uint requestedAmount, uint repaymentsCount, bytes32 creditDescription) public returns(address) {
        // The person should not have active credits;
        require(users[msg.sender].credited == false);
        assert(users[msg.sender].activeCredit == 0);

        users[msg.sender].credited = true;
        Credit credit = new Credit(requestedAmount, repaymentsCount, creditDescription);
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
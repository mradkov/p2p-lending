pragma solidity ^0.4.18;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
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

contract Owned {
    address owner;

    event LogOwnershipTransfered(address indexed _currentOwner, address indexed _newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Owned() public {
        owner = msg.sender;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
        LogOwnershipTransfered(msg.sender, _newOwner);
    }
}

contract Lender is Owned {
    function Lender() public {

    }
}

contract Borrower is Owned {
    function Borrower() public {

    }
}

contract Credit is Owned {

    mapping(address => uint) public lendersBalances;

    address[] lendersList;

    uint requestedAmount;
    uint repaymentsCount;
    string creditDescription;

    uint remainingRepayments;
    bool active;

    modifier isLocked(){
        require(this.balance == requestedAmount);
        _;
    }

    event LogWithdrawBorrower(address indexed _address, uint indexed _amount, uint indexed _timestamp);
    event LogCreditReceived(address indexed _address, uint indexed _amount, uint indexed _timestamp);

    function Credit(uint _requestedAmount, uint _repaymentsCount, string _creditDescription) public {
        requestedAmount = _requestedAmount;
        repaymentsCount = _repaymentsCount;
        remainingRepayments = _repaymentsCount;

        creditDescription = _creditDescription;

        active = true;
    }

    function _receivePayment() public payable {
        lendersBalances[msg.sender] += msg.value;
        lendersList.push(msg.sender);
        LogCreditReceived(msg.sender, msg.value, now);
    }

    function withdraw(uint _amount) public isLocked onlyOwner {
        require(this.balance >= _amount);
        msg.sender.transfer(_amount);
        LogWithdrawBorrower(msg.sender, _amount, now);
    }

    function revertPaymentsIfNotFunded() public {
        for (uint i = 0; i <= lendersList.length; i++){
            lendersList[i].transfer(lendersBalances[lendersList[i]]);
        }
    }

}


contract Credisimo is Owned {

    using SafeMath for uint;

    mapping(address => uint) public deposits;
    mapping(address => uint) public freeAmount;

    address[] public creditList;

    event LogWithdraw(address indexed _address, uint indexed _amount, uint indexed _timestamp);
    event LogInvestInCredit(address indexed _address, uint indexed _amount, uint indexed _timestamp, address _credit);

    function Credisimo() public {

    }

    function applyForCredit(uint _requestedAmount, uint _repaymentsCount, string _creditDescription) public returns(address){
        Credit credit = new Credit(_requestedAmount, _repaymentsCount, _creditDescription);
        creditList.push(credit);
        return credit;
    }

    function investInCredit(address _credit, uint _amount) public returns (bool) {
        freeAmount[msg.sender] -= _amount;
        LogInvestInCredit(msg.sender, _amount, now, _credit);
        _credit.transfer(_amount);
        return true;
    }


    // Deposit ether
    function deposit() public payable {
        deposits[msg.sender] += msg.value;
        freeAmount[msg.sender] += msg.value;
    }

    // Withdraw can only be done to the free amount of the lender,
    // that is currently not borrowed.
    function withdraw(uint _amount) public {
        // Check if free amount is enough.
        require(freeAmount[msg.sender] >= _amount);

        // The balance of the contract should have enough amount for the withdraw request.
        require(this.balance >= _amount);

        // Prevent reentrancy attack by decreasing the amount for lender's account
        freeAmount[msg.sender] -= _amount;

        // Transfer the requested amount.
        msg.sender.transfer(_amount);

        // Log the withdraw event.
        LogWithdraw(msg.sender, _amount, now);
    }

}
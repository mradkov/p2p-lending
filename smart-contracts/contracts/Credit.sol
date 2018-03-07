pragma solidity ^0.4.18;

import './common/SafeMath.sol';
import './common/Ownable.sol';
import './common/Destructible.sol';

/** @title Credit contract.
  * Inherits the Ownable and Destructible contracts.
  */
contract Credit is Ownable, Destructible {
    
    /** @dev Usings */
    // Using SafeMath for our calculations with uints.
    using SafeMath for uint;

    /** @dev State variables */
    // Borrower is the person who generated the credit contract.
    address public borrower;

    // Amount requested to be funded (in wei).
    uint public requestedAmount;

    // Amount that will be returned by the borrower (including the interest).
    uint public returnAmount;

    // Currently repaid amount.
    uint public repaidAmount;

    // Credit interest.
    uint public interest;

    // Requested number of repayment installments.
    uint public requestedRepayments;

    // Remaining repayment installments.
    uint public remainingRepayments;

    // The value of the repayment installment.
    uint public repaymentInstallment;
    
    // The timestamp of credit creation.
    uint public requestedDate;

    // The timestamp of last repayment date.
    uint public lastRepaymentDate;
    
    // Description of the credit.
    bytes32 public description;
    
    // Active state of the credit.
    bool public active = true;

    /** Stages that every credit contract gets trough.
      *   investment - During this state only investments are allowed.
      *   repayment - During this stage only repayments are allowed.
      *   interestReturns - This stage gives investors opportunity to requeste their returns.
      *   expired - This is the stage when the contract is finished its purpose.
    */
    enum State { investment, repayment, interestReturns, expired }
    State state;

    // Storing the lenders for this credit.
    mapping(address => bool) public lenders;

    // Storing the invested amount by each lender.
    mapping(address => uint) public lendersInvestedAmount;

    /** @dev Events
    *
    */
    event LogCreditInitialized(address indexed _address, uint indexed timestamp);
    event LogBorrowerWithdrawal(address indexed _address, uint indexed _amount, uint indexed timestamp);    
    event LogBorrowerRepaymentInstallment(address indexed _address, uint indexed _amount, uint indexed timestamp);    
    event LogBorrowerRepaymentFinished(address indexed _address, uint indexed _amount, uint indexed timestamp);    
    event LogBorrowerChangeReturned(address indexed _address, uint indexed _amount, uint indexed timestamp);    
    event LogLenderInvestment(address indexed _address, uint indexed _amount, uint indexed timestamp);
    event LogLenderWithdrawal(address indexed _address, uint indexed _amount, uint indexed timestamp);
    event LogLenderChangeReturned(address indexed _address, uint indexed _amount, uint indexed timestamp);

    /** @dev Modifiers
    *
    */
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
    
    modifier canAskForInterest() {
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
  
    /** @dev Constructor.
      * @param _requestedAmount Requested credit amount (in wei).
      * @param _requestedRepayments Requested number of repayments.
      * @param _description Credit description.
      */
    function Credit(uint _requestedAmount, uint _requestedRepayments, bytes32 _description) public {
        
        /** Set the borrower of the contract to the tx.origin
          * We are using tx.origin, because the contract is going to be published
          * by the main contract and msg.sender will break our logic.
        */
        borrower = tx.origin;

        // Set the interest for the credit.
        interest = 5000;

        // Set the requested amount.
        requestedAmount = _requestedAmount;

        // Set the requested repayments.
        requestedRepayments = _requestedRepayments;

        /** Set the remaining repayments.
          * Initially this is equal to the requested repayments.        
          */
        remainingRepayments = _requestedRepayments;

        /** Calculate the amount to be returned by the borrower.
          * At this point this is the addition of the requested amount and the interest.
          */
        returnAmount = requestedAmount.add(interest);

        /** Calculating the repayment installment.
          * We divide the amount to be returned by the requested repayments count to get it.
          */
        repaymentInstallment = returnAmount.div(requestedRepayments);

        // Set the credit description.
        description = _description;

        // Set the initialization date.
        requestedDate = now;

        // Log credit initialization.
        LogCreditInitialized(borrower, now);
    }
    
    /** @dev Get current balance.
      * @return this.balance.
      */
    function getBalance() public view returns(uint256) {
        return this.balance;
    }
    
    /** @dev Invest function.
      * Provides functionality for person to invest in someone's credit,
      * incentivised by the return of interest.
      */  
    function invest() public canInvest payable {
        // Initialize an memory variable for the extra money that may have been sent.
        uint extraMoney = 0;

        // Check if contract balance is reached the requested amount.
        if (this.balance >= requestedAmount) {
            
            // Calculate the extra money that may have been sent.
            extraMoney = this.balance.sub(requestedAmount);

            // Assert the calculations
            assert(requestedAmount == this.balance.sub(extraMoney));

            // Assert for possible underflow / overflow
            assert(extraMoney <= msg.value);

            // Check if extra money is greater than 0 wei.
            if (extraMoney > 0) {
                // Return the extra money to the sender.
                msg.sender.transfer(extraMoney);

                // Log change returned.
                LogLenderChangeReturned(msg.sender, extraMoney, now);
            }
            
            // Set the contract state to repayment.
            state = State.repayment;
        }
        
        /** Add the investor to the lenders mapping.
          * So that we know he invested in this contract.
          */
        lenders[msg.sender] = true;

        // Add the amount invested to the amount mapping.
        lendersInvestedAmount[msg.sender] = lendersInvestedAmount[msg.sender].add(msg.value.sub(extraMoney));

        // Log lender invested amount.
        LogLenderInvestment(msg.sender, msg.value.sub(extraMoney), now);
    }
    
    /** @dev Repayment function.
      * Allows borrower to make repayment installments.
      */
    function repay() public onlyBorrower canRepay payable {
        // The remaining repayments should be greater than 0 to continue.
        require(remainingRepayments > 0);

        // The value sent should be greater than the repayment installment.
        require(msg.value >= repaymentInstallment);
        
        /** Assert that the amount to be returned is greater
          * than the sum of repayments made until now. 
          * Otherwise the credit is already repaid.
          */
        assert(repaidAmount < returnAmount);
       
        // Decrement the remaining repayments.
        remainingRepayments--;
        
        // Update last repayment date.
        lastRepaymentDate = now;

        // Initialize an memory variable for the extra money that may have been sent.
        uint extraMoney = 0;

        /** Check if the value (in wei) that is being sent is greather than the repayment installment.
          * In this case we should return the change to the msg.sender.
          */        
        if (msg.value > repaymentInstallment) {

            // Calculate the extra money being sent in the transaction.
            extraMoney = msg.value.sub(repaymentInstallment);

            // Assert the calculations.
            assert(repaymentInstallment == msg.value.sub(extraMoney));

            // Assert for underflow.
            assert(extraMoney <= msg.value);

            // Return the change/extra money to the msg.sender.
            msg.sender.transfer(extraMoney);

            // Log the return of the extra money.
            LogBorrowerChangeReturned(msg.sender, extraMoney, now);
        }
        
        // Add the repayment installment amount to the total repaid amount.
        repaidAmount = repaidAmount.add(msg.value.sub(extraMoney));

        // Check the repaid amount reached the amount to be returned.
        if (repaidAmount == returnAmount) {
            
            // Set the credit state to "returning interests".
            state = State.interestReturns;
        }
    }
    
    /** @dev Withdraw function.
      * It can only be executed while contract is in active state.
      * It is only accessible to the borrower.
      * It is only accessible if the needed amount is gathered in the contract.
      * It can only be executed once.
      * Transfers the gathered amount to the borrower.
      */ 
    function withdraw() public isActive onlyBorrower canWithdraw {
        // Set the state to repayment so we can avoid reentrancy.
        state = State.repayment;

        // Transfer the gathered amount to the credit borrower.
        borrower.transfer(this.balance);
    }
    
    /** @dev Request interest function.
      * It can only be executed while contract is in active state.
      * It is only accessible to lenders.
      * It is only accessible if lender funded 1 or more wei.
      * It can only be executed once.
      * Transfers the lended amount + interest to the lender.
      */ 
    function requestInterest() public isActive onlyLender canAskForInterest {

        // Calculate the interest.
        uint returnInterest = returnAmount.div(lendersInvestedAmount[msg.sender]);

        // Calculate the amount to be returned to lender.
        uint lenderReturnAmount = lendersInvestedAmount[msg.sender].mul(returnInterest);

        // Assert the contract has enough balance to pay the lender. 
        assert(this.balance >= lenderReturnAmount);

        // Transfer the return amount with interest to the lender.
        msg.sender.transfer(lenderReturnAmount);

        // Log the transfer to lender.
        LogLenderWithdrawal(msg.sender, lenderReturnAmount, now);

        // Check if the contract balance is drawned.
        if (this.balance == 0) {

            // Set the active state to false.
            active = false;

            // Set the contract stage to expired e.g. its lifespan is over.
            state = State.expired;
        }
    }

    /** @dev Change state function.
      * @param _state New state.
      * Only accessible to the owner of the contract.
      * Changes the state of the contract.
      */
    function changeStage(State _state) public onlyOwner {
        state = _state;
    }

    /** @dev Toggle active state function.
      * Only accessible to the owner of the contract.
      * Toggles the active state of the contract.
      */
    function toggleActive() public onlyOwner {
        active = !active;
    }

}
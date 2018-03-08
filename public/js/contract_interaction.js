/**
 * Created by milenradkov on 8.03.18.
 */
$(document).ready(function() {
    let peerToPeerLendingContract = '0x156a4a3446b979e3c8af4fff438bc68262ca32ce';
    let peerToPeerLendingContractABI = [ { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCredits", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "credits", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_borrower", "type": "address" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogCreditCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_currentOwner", "type": "address" }, { "indexed": true, "name": "_newOwner", "type": "address" } ], "name": "LogOwnershipTransfered", "type": "event" }, { "constant": false, "inputs": [ { "name": "requestedAmount", "type": "uint256" }, { "name": "repaymentsCount", "type": "uint256" }, { "name": "creditDescription", "type": "bytes32" } ], "name": "applyForCredit", "outputs": [ { "name": "_credit", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_recipient", "type": "address" } ], "name": "destroyAndSend", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ];

    let creditContractABI = [ { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "lenders", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "toggleActive", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "repay", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_state", "type": "uint8" } ], "name": "changeStage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "invest", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "requestInterest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getCreditInfo", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint8" }, { "name": "", "type": "bool" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_recipient", "type": "address" } ], "name": "destroyAndSend", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "_requestedAmount", "type": "uint256" }, { "name": "_requestedRepayments", "type": "uint256" }, { "name": "_description", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogCreditInitialized", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogBorrowerWithdrawal", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogBorrowerRepaymentInstallment", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogBorrowerRepaymentFinished", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogBorrowerChangeReturned", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogLenderInvestment", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogLenderWithdrawal", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_amount", "type": "uint256" }, { "indexed": true, "name": "timestamp", "type": "uint256" } ], "name": "LogLenderChangeReturned", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_currentOwner", "type": "address" }, { "indexed": true, "name": "_newOwner", "type": "address" } ], "name": "LogOwnershipTransfered", "type": "event" } ];
    console.log(peerToPeerLendingContract);

    if (typeof web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    let contract = web3.eth.contract(peerToPeerLendingContractABI).at(peerToPeerLendingContract);


    contract.getCredits(function(err, result) {
        if (!err){
            console.log(result);
        }

        result.forEach(function(index){
            let creditAddress = index;

            let creditContract = web3.eth.contract(creditContractABI).at(creditAddress);

            creditContract.getCreditInfo(function(err, info) {
               if (err){
                   console.log(err);
               }

               let creditContractInfo = {
                   address: creditAddress,
                   borrower: info[0],
                   description: web3.toAscii(info[1]),
                   requestedAmount: info[2].toString(10),
                   requestedRepayments: info[3].toString(10),
                   repaymentInstallment: info[4].toString(10),
                   remainingRepayments: info[5].toString(10),
                   interest: info[6].toString(10),
                   returnAmount: info[7].toString(10),
                   state: parseInt(info[8].toString(10)),
                   active: info[9],
                   balance: info[10].toString(10)
               }

                $('#activeCredits')
                    .append(`<div class="card">
                            <div class="card-header">
                                <h5 class="card-title">${creditContractInfo.description}</h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    <span class="credit-description-property">Address:</span> ${creditContractInfo.address}
                                </p>
                                <p class="card-text">
                                    <span class="credit-description-property">Borrower:</span> ${creditContractInfo.borrower}
                                </p>
                                <p class="card-text">
                                    <span class="credit-description-property">Requested:</span> ${web3.fromWei(creditContractInfo.requestedAmount, "ether")} ETH
                                </p>
                                <p class="card-text">
                                    <span class="credit-description-property">Funded:</span> ${web3.fromWei(creditContractInfo.balance, "ether")} ETH
                                </p>
                                <p class="card-text">
                                    <span class="credit-description-property">Installments Count:</span> ${creditContractInfo.requestedRepayments}
                                </p>
                                <p class="card-text">
                                    <span class="credit-description-property">Interest:</span> ${web3.fromWei(creditContractInfo.interest, "ether")} ETH
                                </p>
                            </div>
                            <div class="card-footer">
                                <div class="input-group mb-3 investment-card">
                                  <input type="number" class="form-control" name="amount" placeholder="Amount" aria-label="Amount" aria-describedby="basic-addon2">
                                  <div class="input-group-append">
                                    <button class="btn btn-outline-success" type="button" name="invest" data-contract-address="${creditContractInfo.address}">Invest</button>
                                  </div>
                                </div>
                                <div class="pull-right">
                                    <button type="button" class="btn btn-info" name="requestInterest" data-contract-address="${creditContractInfo.address}">Request interest</button>
                                </div>
                            </div>
                        </div>`)
            })
        })
    });


    $('body').on('click', 'button[name="invest"]', function (e) {
        e.preventDefault();
        let address = $(this).attr('data-contract-address');
        let amount = $(this).closest('div.investment-card').find('input').val();

        if (amount < 0 || amount == "" || amount == "undefined"){
            alert("Please fill the amount field!");
            return;
        }

        let selectedCreditContract = web3.eth.contract(creditContractABI).at(address);

        var getData = selectedCreditContract.invest.getData();
        web3.eth.sendTransaction({from: web3.eth.coinbase, to: address, data: getData, value:web3.toWei(amount, "ether")}, function (err, result) {
            if (err){
                console.log(err);
            }

            console.log(result);
        })
    });

    $('body').on('click', 'button[name="requestInterest"]', function (e) {
        e.preventDefault();
        let address = $(this).attr('data-contract-address');

        alert('requestInterest from ' + address);
    });

    // contract.applyForCredit(50,5,"test", function(err, result, r1, r2, r3) {
    //     if (err)
    //         return showError("Smart contract call failed: " + e);
    //
    //     console.log(result);
    //
    //     web3.eth.getTransactionReceipt(result, (err, result) => {
    //         console.log(result);
    //     });
    //
    //
    //     console.log(r1);
    //     console.log(r2);
    //     console.log(r3);
    //     showInfo(`Credit <b>successfully added</b> to the registry.`);
    // });

    // create filter
    // var filter = contract.LogCreditCreated({'value1': 0, 'value2': 1, 'value3': 2, 'value4': 3 }, function (error, result) {
    //     if (!error)
    //         console.log(result);
    //     /*
    //      {
    //      address: '0x8718986382264244252fc4abd0339eb8d5708727',
    //      topics: "0x12345678901234567890123456789012", "0x0000000000000000000000000000000000000000000000000000000000000005",
    //      data: "0x0000000000000000000000000000000000000000000000000000000000000001",
    //      ...
    //      }
    //      */
    // });

    // $('#linkHome').click(function() { showView("viewHome") });
    // $('#linkSubmitDocument').click(function() { showView("viewSubmitDocument") });
    // $('#linkVerifyDocument').click(function() { showView("viewVerifyDocument") });
    // $('#documentUploadButton').click(uploadDocument);
    // $('#documentVerifyButton').click(verifyDocument);

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    // function showView(viewName) {
    //     // Hide all views and show the selected view only
    //     $('main > section').hide();
    //     $('#' + viewName).show();
    // }
    //
    function showInfo(message) {
        console.log(message);
        // $('#infoBox>p').html(message);
        // $('#infoBox').show();
        // $('#infoBox>header').click(function(){ $('#infoBox').hide(); });
    }
    //
    function showError(errorMsg) {
        console.log(errorMsg);
        // $('#errorBox>p').html("Error: " + errorMsg);
        // $('#errorBox').show();
        // $('#errorBox>header').click(function(){ $('#errorBox').hide(); });
    }
    //
    // function uploadDocument() {
    //     if ($('#documentForUpload')[0].files.length == 0)
    //         return showError("Please select a file to upload.");
    //     let fileReader = new FileReader();
    //     fileReader.onload = function() {
    //         let documentHash = sha256(fileReader.result);
    //         if (typeof web3 === 'undefined')
    //             return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    //         let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
    //         contract.add(documentHash, function(err, result, r1, r2, r3) {
    //             if (err)
    //                 return showError("Smart contract call failed: " + e);
    //             showInfo(`Document ${documentHash} <b>successfully added</b> to the registry.`);
    //         });
    //     }
    //     fileReader.readAsBinaryString($('#documentForUpload')[0].files[0]);
    // }
    //
    // function verifyDocument() {
    //     if ($('#documentToVerify')[0].files.length == 0)
    //         return showError("Please select a file to verify.");
    //     let fileReader = new FileReader();
    //     fileReader.onload = function() {
    //         let documentHash = sha256(fileReader.result);
    //         if (typeof web3 === 'undefined')
    //             return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    //         let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
    //         contract.verify(documentHash, function(err, result) {
    //             if (err)
    //                 return showError("Smart contract call failed: " + e);
    //             let contractPublishDate = result.c; // Take the output from the execution
    //             if (contractPublishDate > 0) {
    //                 let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
    //                 showInfo(`Document ${documentHash} is <b>valid<b>, date published: ${displayDate}`);
    //             }
    //             else
    //                 return showError(`Document ${documentHash} is <b>invalid</b>: not found in the registry.`);
    //         });
    //     }
    //     fileReader.readAsBinaryString($('#documentToVerify')[0].files[0]);
    // }
});
const SafeMath = artifacts.require("../contracts/common/SafeMath.sol");
const Destructible = artifacts.require("../contracts/common/Destructible.sol");
const Ownable = artifacts.require("../contracts/common/Ownable.sol");
const Credit = artifacts.require("../contracts/Credit.sol");
const PeerToPeerLending = artifacts.require("../contracts/PeerToPeerLending.sol");
module.exports = (deployer) => {
   //deploy

    deployer.deploy(SafeMath);
    deployer.deploy(Destructible);

    deployer.link(SafeMath, Credit);
    deployer.link(Destructible, Credit);

    deployer.link(SafeMath, PeerToPeerLending);
    deployer.link(Destructible, PeerToPeerLending);
    deployer.deploy(PeerToPeerLending);

};
const assert = require('assert');
const ganache = require('gnache-cli');
const Web3 = require('web3');
const web3 = new Web3(gnache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforEach(async () => {
    accounts = await web3.eth.getAccounts();

    //Get the factory contract
    //Deploy the contract from account 0
    factory = await new web3.rth.Contract(Json.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});
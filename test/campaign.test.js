const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { isTypedArray } = require("util/types");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    //Get the factory contract from ABI
    //Deploy the factory from account 0
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" });

    //Create campaign with minimum contribution of 100 wei
    await factory.methods.createCampaign("100").send({
        from: accounts[0],
        gas: "1000000",
    });

    //get first element of campaigns and assign to campaign address
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    //Get a campaign from interfact and campaign address
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe("Campaigns", () => {
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks the caller as the manager of the campaign', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('should allow users to contribute to campaign and mark them as approver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1],
            gas: '1000000'
        })

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(isContributor);
    });

    it('should check a campaign has a minimum contribution set', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1],
                gas: '100000'
            })
            assert(false);
        } catch (err) {
            assert(err);
        }
        const hasContributed = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(!hasContributed);
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest(
                'Description',
                '100',
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();

        assert.equal('Description', request.description)
    });

    //TEST THE WHOLE FLOW
    it('processes requests', async () => {

        //Contributed to comapaing
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: accounts[0],
            gas: '100000'
        });

        //Create a withdraw request
        await campaign.methods
            .createRequest(
                'Description',
                web3.utils.toWei('5', 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

        //Approve a request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //Finalise a request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);

        balance = web3.utils.fromWei(balance, 'ether');

        balance = parseFloat(balance);

        assert(balance > 104);

    });
});

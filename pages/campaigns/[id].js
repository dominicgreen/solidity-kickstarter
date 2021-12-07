import React, { Component } from 'react';
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from "../../ethereum/web3";
import ContributeForm from '../../components/ContributeForm';


class CampaignShow extends Component {
    static async getInitialProps(props) {
        const { id } = props.query;
        const campaign = Campaign(id);
        const summary = await campaign.methods.getSummary().call();

        return {
            address: id,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'Manager created this campaign and can create withdrawls',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much weigh to become a contributor',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                description: 'A requests tries to withdraw money from the contract. Requests must be approved by approvers',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to this campaign',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Ballance (ether)',
                description: 'The ballance is how much moneth this campaign has',
                style: { overflowWrap: 'break-word' }
            },

        ];

        return <Card.Group items={items} />
    }
    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>

                    <Grid.Column width={10}>

                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={this.props.address} />
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;
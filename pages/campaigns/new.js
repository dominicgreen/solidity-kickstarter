import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { router } from 'next';
class CampaignNew extends Component {

    state = {
        minimumContribution: "",
        errorMessage: "",
        loading: false
    }
    onSubmit = async (event) => {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ loading: true })
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            router.push('/');
        } catch (error) {
            this.setState({ loading: false })

            this.setState({ errorMessage: error.message })
        }
    }
    render() {
        return (
            <Layout>
                <h3>Create a new campign</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input
                            placeholder='Minimum contribution'
                            label="WEI"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })} />
                    </Form.Field>
                    <Message error header="OOPS!" content={this.state.errorMessage} />
                    <Button type='submit' primary loading={this.state.loading}>Create Campaign</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew;
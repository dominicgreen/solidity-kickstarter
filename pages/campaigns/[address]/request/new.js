import React, { Component } from 'react';
import Layout from '../../../../components/Layout'
import { Button, Form, Message, Input } from 'semantic-ui-react';
import Link from 'next/link';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { router } from 'next';

class RequestNew extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        return {
            address
        };
    }
    state = {
        description: "",
        value: "",
        recipient: "",
        errorMessage: "",
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true })

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    recipient)
                .send({
                    from: accounts[0]
                });
            router.push(`/campaigns/${this.props.address}/requests`);
        } catch (error) {
            this.setState({ errorMessage: error.message })
        }
        this.setState({ loading: false })
    }




    render() {
        return (
            <Layout>
                <h3>Create a request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => {
                                this.setState({ description: event.target.value })
                            }} />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.value}
                            onChange={event => {
                                this.setState({ value: event.target.value })
                            }} />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => {
                                this.setState({ recipient: event.target.value })
                            }} />
                    </Form.Field>
                    <Message error header="OOPS!" content={this.state.errorMessage} />

                    <Button type='submit' primary loading={this.state.loading}>Create Request</Button>
                </Form>


            </Layout>
        )
    }
}

export default RequestNew;
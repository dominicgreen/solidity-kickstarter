import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { router } from 'next';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: "",
        loading: false
    }
    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ loading: true })
            await campaign.methods
                .contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.value, 'ether')
                });
            router.reload(`/campaigns/${this.props.address}`);
        } catch (error) {

            this.setState({ errorMessage: error.message })
        }
        this.setState({ loading: false })

    }
    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        placeholder='Minimum contribution'
                        label="ether"
                        labelPosition="right"
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })} />
                </Form.Field>
                <Message error header="OOPS!" content={this.state.errorMessage} />
                <Button type='submit' primary loading={this.state.loading}>Contribute</Button>
            </Form>)
    }
}

export default ContributeForm;
import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";

import AccountList from "../Dashboard/AccountList";
import BunqMeTabList from "./BunqMeTabList";
import BunqMeTabForm from "./BunqMeTabForm";

import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";

class BunqMeTab extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        // set the current account selected on the dashboard as the active one
        this.props.accounts.map((account, accountKey) => {
            if (this.props.selectedAccount === account.MonetaryAccountBank.id) {
                this.setState({ selectedAccount: accountKey });
            }
        });
    }

    updateTabs = (userId, accountId) =>
        this.props.bunqMeTabsUpdate(userId, accountId);

    render() {
        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Dashboard`}</title>
                </Helmet>

                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList
                            BunqJSClient={this.props.BunqJSClient}
                            updateExternal={this.updateTabs}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {/* TODO wrap form in collapse wrapper */}
                    <BunqMeTabForm />
                    <Paper>
                        <BunqMeTabList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        requestInquiryLoading: state.request_inquiry.loading,
        selectedAccount: state.accounts.selectedAccount,
        accounts: state.accounts.accounts,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTab);

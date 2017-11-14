import React from "react";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import List, { ListSubheader, ListItemSecondaryAction } from "material-ui/List";
import { CircularProgress, LinearProgress } from "material-ui/Progress";
import RefreshIcon from "material-ui-icons/Refresh";

import AccountListItem from "./AccountListItem";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentInfoUpdate } from "../../Actions/payments";
import { requestResponsesUpdate } from "../../Actions/request_responses";
import { masterCardActionsUpdate } from "../../Actions/master_card_actions";
import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";
import {requestInquiriesUpdate} from "../../Actions/request_inquiries";

const styles = {
    list: {
        textAlign: "left",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: 600
    }
};

class AccountList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // keeps track if we already automatically did a request
            fetchedExternal: false,
            fetchedAccounts: false
        };
    }

    componentDidMount() {
        this.checkUpdateRequirement();
    }

    componentWillUpdate(nextprops) {
        this.checkUpdateRequirement(nextprops);
    }

    updateAccounts = () => {
        this.props.accountsUpdate(this.props.user.id);
    };

    /**
     * By default this updates the payments list
     */
    updateExternal = (userId, accountId) => {
        if (this.props.updateExternal) {
            this.props.updateExternal(userId, accountId);
        } else {
            this.props.paymentsUpdate(userId, accountId);
            this.props.bunqMeTabsUpdate(userId, accountId);
            this.props.requestResponsesUpdate(userId, accountId);
            this.props.requestInquiriesUpdate(userId, accountId);
            this.props.masterCardActionsUpdate(userId, accountId);
        }
    };

    checkUpdateRequirement = (props = this.props) => {
        const {
            accountsAccountId,
            paymentsAccountId,
            paymentsLoading,
            initialBunqConnect,
            accounts,
            user
        } = props;

        if (!initialBunqConnect) {
            return;
        }

        // check if the stored selected account isn't already loaded
        if (
            user.id &&
            accountsAccountId !== false &&
            accountsAccountId !== paymentsAccountId &&
            paymentsLoading === false &&
            this.state.fetchedExternal === false
        ) {
            this.setState({ fetchedExternal: true });
            this.updateExternal(user.id, accountsAccountId);
        }

        // check if both account and payment have nothing selected
        if (
            user.id &&
            accountsAccountId === false &&
            paymentsAccountId === false &&
            paymentsLoading === false
        ) {
            // both are false, just load the first item from the accounts
            if (accounts.length > 0) {
                const accountId = accounts[0].MonetaryAccountBank.id;

                // select this account for next time
                this.props.selectAccount(accountId);
                // fetch payments for the account
                this.updateExternal(user.id, accountId);
                this.setState({ fetchedExternal: true });
            }
        }

        // no accounts loaded
        if (
            accounts.length === 0 &&
            this.state.fetchedAccounts === false &&
            props.user.id &&
            props.accountsLoading === false
        ) {
            this.props.accountsUpdate(props.user.id);
            this.setState({ fetchedAccounts: true });
        }
    };

    render() {
        let accounts = [];
        if (this.props.accounts !== false) {
            accounts = this.props.accounts.map(account => (
                <AccountListItem
                    BunqJSClient={this.props.BunqJSClient}
                    updateExternal={this.updateExternal}
                    account={account.MonetaryAccountBank}
                />
            ));
        }

        return (
            <List style={styles.list}>
                <ListSubheader>
                    Accounts
                    <ListItemSecondaryAction>
                        {this.props.accountsLoading ? (
                            <CircularProgress />
                        ) : (
                            <IconButton onClick={this.updateAccounts}>
                                <RefreshIcon />
                            </IconButton>
                        )}
                    </ListItemSecondaryAction>
                </ListSubheader>

                {this.props.accountsLoading ? <LinearProgress /> : <Divider />}
                <List>{accounts}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        paymentType: state.payment_filter.type,

        accounts: state.accounts.accounts,
        accountsAccountId: state.accounts.selectedAccount,
        accountsLoading: state.accounts.loading,

        requestResponsesAccountId: state.request_responses.account_id,
        requestResponses: state.request_responses.request_responses,
        requestResponsesLoading: state.request_responses.loading,

        masterCardAccountId: state.master_card_actions.account_id,
        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        paymentsAccountId: state.payments.account_id,
        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId)),
        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);

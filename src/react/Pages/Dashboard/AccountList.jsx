import React from "react";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import List, { ListSubheader, ListItemSecondaryAction } from "material-ui/List";
import { CircularProgress, LinearProgress } from "material-ui/Progress";
import RefreshIcon from "material-ui-icons/Refresh";

import AccountListItem from "./AccountListItem";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentsUpdate } from "../../Actions/payments";

const styles = {
    list: {
        textAlign: "left"
    }
};

class AccountList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // keeps track if we already automatically did a request
            fetchedPayments: false,
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

    checkUpdateRequirement = (props = this.props) => {
        const {
            accountsAccountId,
            paymentsAccountId,
            paymentsLoading,
            initialBunqConnect,
            accounts,
            user
        } = props;

        if (initialBunqConnect) {
            // check if the stored selected account isn't already loaded
            if (
                user.id &&
                accountsAccountId !== false &&
                accountsAccountId !== paymentsAccountId &&
                paymentsLoading === false &&
                this.state.fetchedPayments === false
            ) {
                this.props.paymentsUpdate(user.id, accountsAccountId);
                this.setState({ fetchedPayments: true });
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
                    this.props.paymentsUpdate(user.id, accountId);
                    this.setState({ fetchedPayments: true });
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
        }
    };

    render() {
        let accounts = [];
        if (this.props.accounts !== false) {
            accounts = this.props.accounts.map(account => (
                <AccountListItem
                    BunqJSClient={this.props.BunqJSClient}
                    account={account.MonetaryAccountBank}
                />
            ));
        }

        return (
            <List style={styles.list}>
                <ListSubheader>
                    Accounts - {accounts.length}
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
        accounts: state.accounts.accounts,

        paymentsAccountId: state.payments.account_id,
        accountsAccountId: state.accounts.selectedAccount,
        // selected accounts and loading state
        paymentsLoading: state.payments.loading,
        // accounts are loading
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentsUpdate(BunqJSClient, userId, accountId)),
        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);

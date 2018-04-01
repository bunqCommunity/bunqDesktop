import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import List, {
    ListItemText,
    ListItem,
    ListItemSecondaryAction
} from "material-ui/List";
import { CircularProgress, LinearProgress } from "material-ui/Progress";
import RefreshIcon from "material-ui-icons/Refresh";

import AccountListItem from "./AccountListItem";
import AddAccount from "./AddAccount";
import { formatMoney } from "../../Helpers/Utils";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentInfoUpdate } from "../../Actions/payments";
import { requestResponsesUpdate } from "../../Actions/request_responses";
import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../../Actions/request_inquiries";

const styles = {
    list: {
        textAlign: "left",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "90vh"
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
        this.delayedUpdate = null;
    }

    componentDidMount() {
        this.checkUpdateRequirement();
    }

    componentWillUpdate(nextprops) {
        this.checkUpdateRequirement(nextprops);
    }

    componentWillUnmount() {
        // prevent data from being loaded after we unmount
        if (this.delayedUpdate) clearTimeout(this.delayedUpdate);
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
            user
        } = props;

        if (!initialBunqConnect) {
            return;
        }

        // check if the stored selected account isn't already loaded
        if (
            user &&
            user.id &&
            accountsAccountId !== false &&
            accountsAccountId !== paymentsAccountId &&
            paymentsLoading === false &&
            this.state.fetchedExternal === false
        ) {
            this.setState({ fetchedExternal: true });

            // delay the initial loading by 1000ms to improve startup ui performance
            if (this.delayedUpdate) clearTimeout(this.delayedUpdate);
            this.delayedUpdate = setTimeout(() => {
                this.updateExternal(user.id, accountsAccountId);
            }, 500);
        }

        // no accounts loaded
        if (
            this.state.fetchedAccounts === false &&
            props.user.id &&
            props.accountsLoading === false
        ) {
            this.props.accountsUpdate(props.user.id);
            this.setState({ fetchedAccounts: true });
        }
    };

    render() {
        const { t } = this.props;

        let accounts = [];
        if (this.props.accounts !== false) {
            accounts = this.props.accounts
                .filter(account => {
                    if (account && account.status !== "ACTIVE") {
                        return false;
                    }
                    return true;
                })
                .map(account => (
                    <AccountListItem
                        updateExternal={this.updateExternal}
                        BunqJSClient={this.props.BunqJSClient}
                        denseMode={this.props.denseMode}
                        account={account}
                    />
                ));
        }

        const totalBalance = this.props.accounts.reduce((total, account) => {
            if (account.balance) {
                return total + parseFloat(account.balance.value);
            }
            return total;
        }, 0);
        const formattedTotalBalance = formatMoney(totalBalance);

        return (
            <List dense={this.props.denseMode} style={styles.list}>
                <ListItem dense>
                    <ListItemText
                        primary={`${t("Accounts")}: ${accounts.length}`}
                        secondary={
                            this.props.hideBalance ? (
                                ""
                            ) : (
                                `${t("Balance")}: ${formattedTotalBalance}`
                            )
                        }
                    />
                    <ListItemSecondaryAction>
                        {this.props.accountsLoading ? (
                            <CircularProgress />
                        ) : (
                            <IconButton onClick={this.updateAccounts}>
                                <RefreshIcon />
                            </IconButton>
                        )}
                    </ListItemSecondaryAction>
                </ListItem>
                {this.props.accountsLoading ? <LinearProgress /> : <Divider />}
                {accounts}
                {this.props.denseMode === false ? (
                    <AddAccount
                        displayAddAccount={this.props.displayAddAccount}
                    />
                ) : null}
            </List>
        );
    }
}

AccountList.defaultProps = {
    denseMode: false
};

const mapStateToProps = state => {
    return {
        user: state.user.user,

        hideBalance: state.options.hide_balance,

        paymentType: state.payment_filter.type,

        accounts: state.accounts.accounts,
        accountsAccountId: state.accounts.selectedAccount,
        accountsLoading: state.accounts.loading,

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

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(AccountList)
);

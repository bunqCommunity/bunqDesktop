import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import RefreshIcon from "@material-ui/icons/Refresh";

import AccountListItem from "./AccountListItem";
import AddAccount from "./AddAccount";
import { formatMoney } from "../../Helpers/Utils";
import { filterShareInviteBankResponses } from "../../Helpers/Filters";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentInfoUpdate } from "../../Actions/payments";
import { requestResponsesUpdate } from "../../Actions/request_responses";
import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../../Actions/request_inquiries";
import { shareInviteBankResponsesInfoUpdate } from "../../Actions/share_invite_bank_response";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiry";

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
        const userId = this.props.user.id;
        this.props.accountsUpdate(userId);
        this.props.shareInviteBankResponsesInfoUpdate(userId);
        // this.props.shareInviteBankInquiriesInfoUpdate(userId);
    };

    /**
     * By default this updates the payments list
     */
    updateExternal = (userId, accountId) => {
        if (this.props.updateExternal) {
            this.props.updateExternal(userId, accountId);
        } else {
            this.props.accountsUpdate(userId);
            this.props.paymentsUpdate(userId, accountId);
            this.props.bunqMeTabsUpdate(userId, accountId);
            this.props.requestResponsesUpdate(userId, accountId);
            this.props.requestInquiriesUpdate(userId, accountId);
            this.props.masterCardActionsUpdate(userId, accountId);
        }
    };

    checkUpdateRequirement = (props = this.props) => {
        const {
            accounts,
            accountsAccountId,
            paymentsAccountId,
            paymentsLoading,
            initialBunqConnect,
            user
        } = props;

        if (!initialBunqConnect) {
            return;
        }

        if (accountsAccountId === false && accounts.length > 0) {
            // get the first active account in the accounts list
            const firstAccount = accounts.find(account => {
                return account && account.status === "ACTIVE";
            });

            if (firstAccount && firstAccount.id)
                this.props.selectAccount(firstAccount.id);
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
        const {
            t,
            shareInviteBankResponses,
            shareInviteBankInquiries
        } = this.props;

        let accounts = [];
        if (this.props.accounts !== false) {
            accounts = this.props.accounts
                .filter(account => {
                    if (account && account.status !== "ACTIVE") {
                        return false;
                    }
                    return true;
                })
                .map(account => {
                    const filteredResponses = shareInviteBankResponses.filter(
                        filterShareInviteBankResponses(account.id)
                    );

                    return (
                        <AccountListItem
                            updateExternal={this.updateExternal}
                            BunqJSClient={this.props.BunqJSClient}
                            denseMode={this.props.denseMode}
                            account={account}
                            isJoint={
                                account.accountType === "MonetaryAccountJoint"
                            }
                            shareInviteBankResponses={filteredResponses}
                        />
                    );
                });
        }

        const totalBalance = this.props.accounts.reduce((total, account) => {
            if (account.balance) {
                return total + parseFloat(account.balance.value);
            }
            return total;
        }, 0);
        const formattedTotalBalance = formatMoney(totalBalance, true);

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
                    <React.Fragment>
                        <AddAccount
                            displayAddAccount={this.props.displayAddAccount}
                        />
                        <Divider />
                    </React.Fragment>
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

        accounts: state.accounts.accounts,
        accountsAccountId: state.accounts.selectedAccount,
        accountsLoading: state.accounts.loading,

        shareInviteBankResponses:
            state.share_invite_bank_responses.share_invite_bank_responses,
        shareInviteBankInquiries:
            state.share_invite_bank_inquiries.share_invite_bank_inquiries,

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
        shareInviteBankResponsesInfoUpdate: userId =>
            dispatch(shareInviteBankResponsesInfoUpdate(BunqJSClient, userId)),
        shareInviteBankInquiriesInfoUpdate: userId =>
            dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(AccountList)
);

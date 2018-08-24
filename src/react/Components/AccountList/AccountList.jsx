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
import GetShareDetailBudget from "../../Helpers/GetShareDetailBudget";
import { filterShareInviteBankResponses } from "../../Helpers/DataFilters";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentInfoUpdate } from "../../Actions/payments";
import { requestResponsesUpdate } from "../../Actions/request_responses";
import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../../Actions/request_inquiries";
import { shareInviteBankResponsesInfoUpdate } from "../../Actions/share_invite_bank_responses";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiries";
import { applicationSetLastAutoUpdate } from "../../Actions/application";

const styles = {
    list: {
        textAlign: "left",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "calc(90vh - 150px)"
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

    getSnapshotBeforeUpdate(previousProps, previousState) {
        this.checkUpdateRequirement(this.props);
        return null;
    }
    componentDidUpdate() {}

    componentWillUnmount() {
        // prevent data from being loaded after we unmount
        if (this.delayedUpdate) clearTimeout(this.delayedUpdate);
    }

    updateAccounts = () => {
        const userId = this.props.user.id;
        const selectedAccountId = this.props.accountsSelectedId;

        if (!this.props.accountsLoading) this.props.accountsUpdate(userId);

        if (!this.props.shareInviteBankInquiriesLoading)
            this.props.shareInviteBankInquiriesInfoUpdate(
                userId,
                selectedAccountId
            );

        if (!this.props.shareInviteBankResponsesLoading)
            this.props.shareInviteBankResponsesInfoUpdate(userId);
    };

    /**
     * By default this updates the payments list
     */
    updateExternal = (userId, accountId) => {
        if (this.props.updateExternal) {
            this.props.updateExternal(userId, accountId);
        } else {
            // update the last updated timestamp
            this.props.applicationSetLastAutoUpdate();

            // update all the accounts and events
            if (!this.props.accountsLoading) this.props.accountsUpdate(userId);

            if (!this.props.paymentsLoading)
                this.props.paymentsUpdate(userId, accountId);
            if (!this.props.bunqMeTabsLoading)
                this.props.bunqMeTabsUpdate(userId, accountId);
            if (!this.props.requestResponsesLoading)
                this.props.requestResponsesUpdate(userId, accountId);
            if (!this.props.requestInquiriesLoading)
                this.props.requestInquiriesUpdate(userId, accountId);
            if (!this.props.masterCardActionsLoading)
                this.props.masterCardActionsUpdate(userId, accountId);

            if (!this.props.shareInviteBankInquiriesLoading)
                this.props.shareInviteBankInquiriesInfoUpdate(
                    userId,
                    accountId
                );
            if (!this.props.shareInviteBankResponsesLoading)
                this.props.shareInviteBankResponsesInfoUpdate(userId);
        }
    };

    checkUpdateRequirement = (props = this.props) => {
        const {
            accounts,
            accountsSelectedId,
            paymentsAccountId,
            paymentsLoading,
            initialBunqConnect,
            user
        } = props;

        if (!initialBunqConnect) {
            return;
        }

        if (accountsSelectedId === false && accounts.length > 0) {
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
            accountsSelectedId !== false &&
            accountsSelectedId !== paymentsAccountId &&
            paymentsLoading === false &&
            this.state.fetchedExternal === false
        ) {
            this.setState({ fetchedExternal: true });

            // check if the list was updated in the last 60 seconds
            if (
                this.props.applicationLastAutoUpdate !== false &&
                this.props.applicationLastAutoUpdate.getTime() >
                    new Date(new Date().getTime() - 300000).getTime()
            ) {
                return false;
            }

            // delay the initial loading by 1000ms to improve startup ui performance
            if (this.delayedUpdate) clearTimeout(this.delayedUpdate);
            this.delayedUpdate = setTimeout(() => {
                this.updateExternal(user.id, accountsSelectedId);
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
                // get responses for this account
                const filteredResponses = shareInviteBankResponses.filter(
                    filterShareInviteBankResponses(account.id)
                );

                // get budget from this response
                if (filteredResponses.length > 0) {
                    const connectBudget = GetShareDetailBudget(
                        filteredResponses
                    );

                    if (connectBudget) return total + parseFloat(connectBudget);
                }

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
                            this.props.hideBalance
                                ? ""
                                : `${t("Balance")}: ${formattedTotalBalance}`
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={this.updateAccounts}
                            disabled={this.props.accountsLoading}
                        >
                            <RefreshIcon />
                        </IconButton>
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
        applicationLastAutoUpdate: state.application.last_auto_update,

        hideBalance: state.options.hide_balance,

        accounts: state.accounts.accounts,
        accountsSelectedId: state.accounts.selectedAccount,
        accountsLoading: state.accounts.loading,

        shareInviteBankResponses:
            state.share_invite_bank_responses.share_invite_bank_responses,
        shareInviteBankResponsesLoading:
            state.share_invite_bank_responses.loading,

        shareInviteBankInquiries:
            state.share_invite_bank_inquiries.share_invite_bank_inquiries,
        shareInviteBankInquiriesLoading:
            state.share_invite_bank_inquiries.loading,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        requestResponsesLoading: state.request_responses.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        masterCardActionsLoading: state.master_card_actions.loading
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
        shareInviteBankInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(
                shareInviteBankInquiriesInfoUpdate(
                    BunqJSClient,
                    userId,
                    accountId
                )
            ),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId)),

        applicationSetLastAutoUpdate: () =>
            dispatch(applicationSetLastAutoUpdate())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(AccountList));

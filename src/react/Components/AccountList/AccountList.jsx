import React from "react";
import { ipcRenderer } from "electron";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import LinearProgress from "@material-ui/core/LinearProgress";
import RefreshIcon from "@material-ui/icons/Refresh";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";

import LimitedPremiumListItem from "../LimitedPremiumListItem";
import AccountListItem from "./AccountListItem";
import AddAccount from "./AddAccount";
import { formatMoney } from "../../Functions/Utils";
import { connectGetBudget } from "../../Functions/ConnectGetPermissions";
import { filterShareInviteMonetaryAccountResponses } from "../../Functions/DataFilters";

import {
    accountsSelectAccount,
    accountsUpdate,
    accountExcludeFromTotal,
    accountIncludeInTotal
} from "../../Actions/accounts";
import { paymentInfoUpdate } from "../../Actions/payments";
import { requestResponsesUpdate } from "../../Actions/request_responses";
import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../../Actions/request_inquiries";
import { updateStatisticsSavingsGoals } from "../../Actions/savings_goals";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "../../Actions/share_invite_monetary_account_responses";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "../../Actions/share_invite_monetary_account_inquiries";

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
            fetchedAccounts: false,
            accountTotalSelectionMode: false,

            totalBalance: 0
        };
    }

    componentDidMount() {
        this.checkUpdateRequirement();
    }

    componentDidUpdate(previousProps) {
        const { excludedAccountIds, shareInviteMonetaryAccountResponses, accounts } = this.props;
        this.checkUpdateRequirement(this.props);

        const accountsTrayItems = [];
        const totalBalance = accounts
            .filter(account => {
                return account && account.status === "ACTIVE";
            })
            .reduce((total, account) => {
                const accountTrayItem = {
                    description: account.description,
                    balance: formatMoney(account.getBalance())
                };

                if (account.balance) {
                    if (excludedAccountIds) {
                        const isExcluded = excludedAccountIds.some(
                            excludedAccountId => account.id === excludedAccountId
                        );
                        // is excluded so we don't calculate anything
                        if (isExcluded) return total;
                    }

                    // get responses for this account
                    const filteredResponses = shareInviteMonetaryAccountResponses.filter(
                        filterShareInviteMonetaryAccountResponses(account.id)
                    );

                    // get budget from this response
                    if (filteredResponses.length > 0) {
                        const connectBudget = connectGetBudget(filteredResponses);

                        if (connectBudget) {
                            accountTrayItem.balance = formatMoney(parseFloat(connectBudget));
                            accountsTrayItems.push(accountTrayItem);

                            return total + parseFloat(connectBudget);
                        }
                    }
                    accountsTrayItems.push(accountTrayItem);
                    return total + parseFloat(account.balance.value);
                }
                accountsTrayItems.push(accountTrayItem);
                return total;
            }, 0);

        if (
            (previousProps.accountsLoading && !this.props.accountsLoading) ||
            (previousProps.shareInviteMonetaryAccountResponsesLoading &&
                !this.props.shareInviteMonetaryAccountResponsesLoading)
        ) {
            // update the savings goals when the accounts are updated
            this.props.updateStatisticsSavingsGoals(
                this.props.accounts,
                this.props.shareInviteMonetaryAccountResponses
            );
        }

        if (this.state.totalBalance !== totalBalance) {
            this.setState({
                totalBalance: totalBalance
            });
            ipcRenderer.send("set-tray-balance", formatMoney(totalBalance));
            ipcRenderer.send("set-tray-accounts", accountsTrayItems);
        }
    }

    updateAccounts = () => {
        const userId = this.props.user.id;
        const selectedAccountId = this.props.accountsSelectedId;

        if (!this.props.accountsLoading) {
            this.props.accountsUpdate(userId);
        }
        if (
            !this.props.shareInviteBankInquiriesLoading &&
            this.props.limitedPermissions === false &&
            selectedAccountId
        ) {
            this.props.shareInviteMonetaryAccountInquiriesInfoUpdate(userId, selectedAccountId);
        }
        if (!this.props.shareInviteMonetaryAccountResponsesLoading) {
            this.props.shareInviteMonetaryAccountResponsesInfoUpdate(userId);
        }
    };

    checkUpdateRequirement = () => {
        const {
            user,
            accounts,
            accountsSelectedId,
            registrationReady,
            accountsLoading,
            registrationIsLoading
        } = this.props;
        if (!registrationReady) {
            return;
        }

        // if no account is selected, we select one automatically
        if (accountsSelectedId === false && accounts.length > 0) {
            // get the first active account in the accounts list
            const firstAccount = accounts.find(account => {
                return account && account.status === "ACTIVE";
            });

            if (firstAccount && firstAccount.id) this.props.selectAccount(firstAccount.id);
        }

        // no accounts loaded
        if (
            this.state.fetchedAccounts === false &&
            user.id &&
            accountsLoading === false &&
            registrationIsLoading === false
        ) {
            this.updateAccounts();
            this.setState({ fetchedAccounts: true });
        }
    };

    accountExcludeFromTotal = accountId => event => {
        this.props.accountExcludeFromTotal(accountId);
    };
    accountIncludeInTotal = accountId => event => {
        this.props.accountIncludeInTotal(accountId);
    };

    toggleAccountTotalSelectionMode = () => {
        this.setState({
            accountTotalSelectionMode: !this.state.accountTotalSelectionMode
        });
    };

    render() {
        const { t, user, shareInviteMonetaryAccountResponses, excludedAccountIds = [] } = this.props;
        const { accountTotalSelectionMode } = this.state;

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
                    const filteredResponses = shareInviteMonetaryAccountResponses.filter(
                        filterShareInviteMonetaryAccountResponses(account.id)
                    );

                    // set external if added or default to false
                    let onClickHandler = this.props.updateExternal
                        ? (userId, accountId) => {
                              this.props.selectAccount(accountId);
                              this.props.updateExternal(userId, accountId);
                          }
                        : false;

                    let secondaryAction = false;
                    if (accountTotalSelectionMode) {
                        const excluded = excludedAccountIds.some(excludedAccountId => account.id === excludedAccountId);

                        // overwrite click handler
                        onClickHandler = excluded
                            ? this.accountIncludeInTotal(account.id)
                            : this.accountExcludeFromTotal(account.id);

                        // set a custom secondary action
                        secondaryAction = <Checkbox checked={!excluded} onChange={onClickHandler} />;
                    }

                    return (
                        <AccountListItem
                            onClick={onClickHandler}
                            BunqJSClient={this.props.BunqJSClient}
                            denseMode={this.props.denseMode}
                            account={account}
                            isJoint={!!account.all_co_owner}
                            shareInviteMonetaryAccountResponses={filteredResponses}
                            secondaryAction={secondaryAction}
                        />
                    );
                });
        }

        const formattedTotalBalance = formatMoney(this.state.totalBalance, true);

        let isBunqPromoUser = false;
        if (user && user.customer_limit && user.customer_limit.limit_amount_monthly) {
            isBunqPromoUser = true;
        }

        return (
            <List dense={this.props.denseMode} style={styles.list}>
                <ListItem dense>
                    <ListItemText
                        primary={`${t("Accounts")}: ${accounts.length}`}
                        secondary={this.props.hideBalance ? "" : `${t("Balance")}: ${formattedTotalBalance}`}
                    />
                    <ListItemSecondaryAction>
                        <IconButton onClick={this.toggleAccountTotalSelectionMode}>
                            {this.state.accountTotalSelectionMode ? <CheckBoxIcon /> : <CheckBoxOutlinedIcon />}
                        </IconButton>
                        <IconButton onClick={this.updateAccounts} disabled={this.props.accountsLoading}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>

                {isBunqPromoUser && (
                    <React.Fragment>
                        <Divider />
                        <LimitedPremiumListItem t={t} user={user} />
                    </React.Fragment>
                )}

                {this.props.accountsLoading ? <LinearProgress /> : <Divider />}
                {accounts}

                {this.props.denseMode === false && this.props.limitedPermissions === false ? (
                    <React.Fragment>
                        <AddAccount displayAddAccount={this.props.displayAddAccount} />
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
        userType: state.user.user_type,
        limitedPermissions: state.user.limited_permissions,

        applicationLastAutoUpdate: state.application.last_auto_update,

        hideBalance: state.options.hide_balance,

        registrationIsLoading: state.registration.loading,
        registrationReady: state.registration.ready,

        accounts: state.accounts.accounts,
        accountsSelectedId: state.accounts.selected_account,
        accountsLoading: state.accounts.loading,
        excludedAccountIds: state.accounts.excluded_account_ids,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,
        shareInviteMonetaryAccountResponsesLoading: state.share_invite_monetary_account_responses.loading,
        shareInviteBankInquiriesLoading: state.share_invite_monetary_account_inquiries.loading,

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
        paymentsUpdate: (userId, accountId) => dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) => dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId)),

        accountsUpdate: userId => dispatch(accountsUpdate(BunqJSClient, userId)),

        accountExcludeFromTotal: accountId => dispatch(accountExcludeFromTotal(accountId)),
        accountIncludeInTotal: accountId => dispatch(accountIncludeInTotal(accountId)),

        shareInviteMonetaryAccountResponsesInfoUpdate: userId =>
            dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(BunqJSClient, userId)),
        shareInviteMonetaryAccountInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(BunqJSClient, userId, accountId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId)),

        updateStatisticsSavingsGoals: (accounts, shareInviteMonetaryAccountResponses) =>
            dispatch(updateStatisticsSavingsGoals(accounts, shareInviteMonetaryAccountResponses))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AccountList));

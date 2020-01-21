import BunqJSClient from "@bunq-community/bunq-js-client";
import React, { CSSProperties } from "react";
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
import { AppWindow } from "~app";
import { accountsUpdate } from "~store/accounts/thunks";
import { AppDispatch, ReduxState } from "~store/index";

import LimitedPremiumListItem from "../LimitedPremiumListItem";
import AccountListItem from "./AccountListItem";
import AddAccount from "./AddAccount";
import { formatMoney } from "~functions/Utils";
import { connectGetBudget } from "~functions/ConnectGetPermissions";
import { filterShareInviteMonetaryAccountResponses } from "~functions/DataFilters";

import { paymentInfoUpdate } from "~actions/payments";
import { requestResponsesUpdate } from "~actions/request_responses";
import { masterCardActionsUpdate } from "~actions/master_card_actions";
import { requestInquiriesUpdate } from "~actions/request_inquiries";
import { updateStatisticsSavingsGoals } from "~actions/savings_goals";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "~actions/share_invite_monetary_account_responses";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "~actions/share_invite_monetary_account_inquiries";
import { actions as accountsActions } from "~store/accounts";
import { actions as bunqMeTabsActions } from "~store/bunqMeTabs";

const styles = {
    list: {
        textAlign: "left",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "calc(90vh - 150px)"
    }
};

interface IState {
    totalBalance: number;
    fetchedAccounts: any;
    accountTotalSelectionMode: any;
    [key: string]: any;
}

interface IProps {
    t: AppWindow["t"];
    BunqJSClient: BunqJSClient;
    [key: string]: any;
}

class AccountList extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        denseMode: false
    };

    state: IState;

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
        this.checkUpdateRequirement();

        const accountsTrayItems = [];
        const totalBalance = accounts
            .filter(account => {
                return account && account.status === "ACTIVE";
            })
            .reduce((total, account) => {
                const accountTrayItem = {
                    description: account.description,
                    balance: formatMoney(account.balance.value)
                };

                if (account?.balance?.value) {
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
                        const connectBudget: any = connectGetBudget(filteredResponses);

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

    accountExcludeFromTotal = accountId => () => {
        this.props.accountExcludeFromTotal(accountId);
    };
    accountIncludeInTotal = accountId => () => {
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
        if (this.props.accounts.length) {
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

                    let secondaryAction: false | React.ReactNode = false;
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
            <List dense={this.props.denseMode} style={styles.list as CSSProperties}>
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
                    <>
                        <Divider />
                        <LimitedPremiumListItem t={t} user={user} />
                    </>
                )}

                {this.props.accountsLoading ? <LinearProgress /> : <Divider />}
                {accounts}

                {this.props.denseMode === false && this.props.limitedPermissions === false ? (
                    <>
                        <AddAccount displayAddAccount={this.props.displayAddAccount} />
                        <Divider />
                    </>
                ) : null}
            </List>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user.user,
        userType: state.user.user_type,

        // @ts-ignore
        limitedPermissions: state.user.limited_permissions,

        applicationLastAutoUpdate: state.application.last_auto_update,

        // @ts-ignore
        hideBalance: state.options.hide_balance,

        registrationIsLoading: state.registration.loading,
        registrationReady: state.registration.ready,

        accounts: state.accounts.accounts,
        accountsSelectedId: state.accounts.selectedAccount,
        accountsLoading: state.accounts.loading,
        excludedAccountIds: state.accounts.excludedAccountIds,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,
        shareInviteMonetaryAccountResponsesLoading: state.share_invite_monetary_account_responses.loading,
        shareInviteBankInquiriesLoading: state.share_invite_monetary_account_inquiries.loading,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunqMeTabs.loading,
        requestResponsesLoading: state.request_responses.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        masterCardActionsLoading: state.master_card_actions.loading
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        paymentsUpdate: (userId, accountId) => dispatch(paymentInfoUpdate(userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) => dispatch(bunqMeTabsActions.setInfo({ resetOldItems: false, user_id: userId, account_id: accountId })),

        accountsUpdate: userId => dispatch(accountsUpdate(userId)),

        accountExcludeFromTotal: accountId => dispatch(accountsActions.excludeFromTotal(accountId)),
        accountIncludeInTotal: accountId => dispatch(accountsActions.includeInTotal(accountId)),

        shareInviteMonetaryAccountResponsesInfoUpdate: userId =>
            dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(userId)),
        shareInviteMonetaryAccountInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId)),
        selectAccount: accountId => dispatch(accountsActions.selectAccount(accountId)),

        updateStatisticsSavingsGoals: (accounts, shareInviteMonetaryAccountResponses) =>
            dispatch(updateStatisticsSavingsGoals(accounts, shareInviteMonetaryAccountResponses))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AccountList));

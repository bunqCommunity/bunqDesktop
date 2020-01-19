import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import LinkIcon from "@material-ui/icons/Link";
import PeopleIcon from "@material-ui/icons/People";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../../Components/Routing/NavLink";
import AccountAvatarCircularProgress from "./AccountAvatarCircularProgress";

import { formatMoney } from "../../Functions/Utils";
import { connectGetBudget } from "../../Functions/ConnectGetPermissions";

import { accountsSelectAccount } from "../../Actions/accounts.js";
import { addAccountIdFilter, removeAccountIdFilter, toggleAccountIdFilter } from "../../Actions/filters";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    },
    avatarSub: {
        minWidth: 26,
        marginLeft: -23,
        marginTop: 40,
        zIndex: 10
    },
    secondaryIcon: {
        width: 26,
        height: 26,
        color: "#ffffff",
        backgroundColor: "#ffa500"
    }
};

class AccountListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            t,
            user,
            account,
            shareInviteMonetaryAccountResponses,
            selectedAccountIds,
            toggleAccountIds
        } = this.props;

        if (account.status !== "ACTIVE") {
            return null;
        }

        let isSavingsAccount = false;
        if (account.accountType === "MonetaryAccountSavings") {
            isSavingsAccount = true;
        }

        let avatarSub = null;
        if (this.props.isJoint) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <PeopleIcon />
                </Avatar>
            );
        } else if (shareInviteMonetaryAccountResponses.length > 0) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <LinkIcon />
                </Avatar>
            );
        }

        let accountBalance = account.balance ? account.balance.value : 0;
        if (shareInviteMonetaryAccountResponses.length > 0) {
            const connectBudget = connectGetBudget(shareInviteMonetaryAccountResponses);
            if (connectBudget) {
                accountBalance = connectBudget;
            }
        }
        const formattedBalance = this.props.hideBalance ? "" : formatMoney(accountBalance, true);

        let secondaryText = formattedBalance;
        if (isSavingsAccount) {
            const targetAmount = formatMoney(account.savings_goal.value);
            const savingsPercentage = parseFloat(account.savings_goal_progress) * 100;
            secondaryText = this.props.hideBalance
                ? `${savingsPercentage.toFixed(2)}%`
                : `${formattedBalance} ${t("out of")} ${targetAmount} - (${savingsPercentage.toFixed(2)}%)`;
        }

        // check if any of the selected account ids are for this account
        let displayStyle = {
            height: 83,
            paddingLeft: 20
        };
        let accountIsSelected = false;
        let displayAsSelected = false;
        if (selectedAccountIds.length !== 0) {
            // check if the selected account ids list contains this account
            accountIsSelected = selectedAccountIds.some(id => id === account.id);
            // switch if toggle is true
            displayAsSelected = toggleAccountIds ? !accountIsSelected : accountIsSelected;

            if (displayAsSelected) {
                displayStyle = {
                    borderLeft: "4px solid #1da1f2",
                    paddingLeft: 16,
                    height: 83
                };
            }
        }

        // decide which onClick event is used based on
        const defaultClickHandler = accountIsSelected
            ? e => this.props.removeAccountIdFilter(account.id)
            : e => this.props.addAccountIdFilter(account.id);

        const listItemProps = {};
        if (this.props.clickable) {
            listItemProps.button = true;
            listItemProps.onClick = this.props.onClick
                ? e => this.props.onClick(user.id, account.id)
                : defaultClickHandler;
        }

        return (
            <ListItem {...listItemProps} style={displayStyle} divider>
                <AccountAvatarCircularProgress account={account} selected={displayAsSelected} />
                <Avatar style={styles.bigAvatar}>
                    <LazyAttachmentImage
                        height={60}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={account.avatar.image[0].attachment_public_uuid}
                    />
                </Avatar>
                <div style={styles.avatarSub}>{avatarSub}</div>
                <ListItemText primary={account.description} secondary={secondaryText} />
                <ListItemSecondaryAction>
                    {this.props.secondaryAction ? (
                        this.props.secondaryAction
                    ) : (
                        <IconButton to={`/account-info/${account.id}`} component={NavLink}>
                            <InfoIcon />
                        </IconButton>
                    )}
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        theme: state.options.theme,
        paymentsLoading: state.payments.loading,
        hideBalance: state.options.hide_balance,

        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId)),

        addAccountIdFilter: accountId => dispatch(addAccountIdFilter(accountId)),
        removeAccountIdFilter: index => dispatch(removeAccountIdFilter(index)),
        toggleAccountIdFilter: () => dispatch(toggleAccountIdFilter())
    };
};

AccountListItem.defaultProps = {
    clickable: true,
    denseMode: false,
    isJoint: false,
    shareInviteMonetaryAccountResponses: [],
    secondaryAction: false
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AccountListItem));

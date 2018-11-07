import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import LinkIcon from "@material-ui/icons/Link";
import PeopleIcon from "@material-ui/icons/People";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../../Components/Routing/NavLink";

import { formatMoney } from "../../Helpers/Utils";
import GetShareDetailBudget from "../../Helpers/GetShareDetailBudget";

import { accountsSelectAccount } from "../../Actions/accounts.js";
import { addAccountIdFilter, removeAccountIdFilter, toggleAccountIdFilter } from "../../Actions/filters";
import LinearProgress from "../LinearProgress";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    },
    avatarSub: {
        position: "absolute",
        left: 60,
        bottom: 4
    },
    secondaryIcon: {
        width: 26,
        height: 26,
        color: "#ffffff",
        backgroundColor: "#ffa500"
    },
    overlayCircular: {
        position: "absolute",
        width: 68,
        height: 68,
        top: 7
    }
};

class AccountListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { user, account, shareInviteBankResponses, selectedAccountIds, toggleAccountIds } = this.props;

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
        } else if (shareInviteBankResponses.length > 0) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <LinkIcon />
                </Avatar>
            );
        }

        let formattedBalance = account.balance ? account.balance.value : 0;
        if (shareInviteBankResponses.length > 0) {
            const connectBudget = GetShareDetailBudget(shareInviteBankResponses);
            if (connectBudget) {
                formattedBalance = connectBudget;
            }
        }
        formattedBalance = this.props.hideBalance ? "" : formatMoney(formattedBalance, true);

        let secondaryText = formattedBalance;
        let savingsPercentage = 0;
        if (isSavingsAccount) {
            savingsPercentage = (account.savings_goal_progress * 100).toFixed(2);
            secondaryText = `${formattedBalance} - ${savingsPercentage}%`;
        }

        // check if any of the selected account ids are for this account
        let displayStyle = {};
        let circularLeftPostion = 20;
        let accountIsSelected = false;
        if (selectedAccountIds.length !== 0) {
            // check if the selected account ids list contains this account
            accountIsSelected = selectedAccountIds.some(id => id === account.id);
            // switch if toggle is true
            const isSelected = toggleAccountIds ? !accountIsSelected : accountIsSelected;

            if (isSelected) {
                circularLeftPostion = 16;
                displayStyle = {
                    borderLeft: "4px solid #1da1f2",
                    paddingLeft: 20
                };
            }
        }

        // decide which onClick event is used based on
        const defaultClickHandler = accountIsSelected
            ? e => this.props.removeAccountIdFilter(account.id)
            : e => this.props.addAccountIdFilter(account.id);

        // allow overwrite by props
        const onClickHandler = this.props.onClick ? e => this.props.onClick(user.id, account.id) : defaultClickHandler;
        const isDarkTheme = this.props.theme === "DarkTheme";

        return (
            <ListItem button onClick={onClickHandler} style={displayStyle} divider>
                {isSavingsAccount && (
                    <React.Fragment>
                        <CircularProgress
                            variant="static"
                            value={savingsPercentage}
                            style={{
                                ...styles.overlayCircular,
                                zIndex: 2,
                                left: circularLeftPostion
                            }}
                        />
                        <div
                            style={{
                                ...styles.overlayCircular,
                                zIndex: 1,
                                left: circularLeftPostion
                            }}
                        >
                            <svg viewBox="22 22 44 44">
                                <circle
                                    cx="44"
                                    cy="44"
                                    r="20.2"
                                    fill="none"
                                    strokeWidth="3.6"
                                    stroke={isDarkTheme ? "#58585d" : "#e8e8e8"}
                                    style={{
                                        strokeDasharray: 126.92,
                                        strokeDashoffset: 0
                                    }}
                                />
                            </svg>
                        </div>
                    </React.Fragment>
                )}
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
    shareInviteBankResponses: [],
    secondaryAction: false
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountListItem);

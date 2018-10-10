import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import LinkIcon from "@material-ui/icons/Link";
import PeopleIcon from "@material-ui/icons/People";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../../Components/Routing/NavLink";

import { formatMoney } from "../../Helpers/Utils";
import GetShareDetailBudget from "../../Helpers/GetShareDetailBudget";

import { accountsSelectAccount } from "../../Actions/accounts.js";
import { addAccountIdFilter, removeAccountIdFilter, toggleAccountIdFilter } from "../../Actions/filters";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
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
        const { user, account, shareInviteBankResponses, selectedAccountIds, toggleAccountIds } = this.props;

        if (account.status !== "ACTIVE") {
            return null;
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

        // check if any of the selected account ids are for this account
        let displaySelectIcon = false;
        let accountIsSelected = false;
        if (selectedAccountIds.length !== 0) {
            // check if the selected account ids list contains this account
            accountIsSelected = selectedAccountIds.some(selectedAccountId => selectedAccountId === account.id);

            // switch if toggle is true
            displaySelectIcon = toggleAccountIds ? !accountIsSelected : accountIsSelected;
        }

        // decide which onClick event is used based on
        const defaultClickHandler = accountIsSelected
            ? e => this.props.removeAccountIdFilter(account.id)
            : e => this.props.addAccountIdFilter(account.id);

        // allow overwrite by props
        const onClickHandler = this.props.onClick ? e => this.props.onClick(user.id, account.id) : defaultClickHandler;

        return (
            <ListItem divider button onClick={onClickHandler}>
                <Avatar style={styles.bigAvatar}>
                    <LazyAttachmentImage
                        height={60}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={account.avatar.image[0].attachment_public_uuid}
                    />
                </Avatar>
                <div style={{ position: "absolute", left: 60, bottom: 4 }}>{avatarSub}</div>
                <ListItemText primary={account.description} secondary={formattedBalance} />
                <ListItemSecondaryAction>
                    {this.props.secondaryAction ? (
                        this.props.secondaryAction
                    ) : (
                        <IconButton to={`/account-info/${account.id}`} component={NavLink}>
                            {displaySelectIcon ? <KeyboardArrowRightIcon /> : <InfoIcon />}
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

        paymentsLoading: state.payments.loading,

        accountsAccountId: state.accounts.selected_account,

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

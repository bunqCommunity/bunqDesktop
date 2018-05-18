import React from "react";
import { connect } from "react-redux";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import InfoIcon from "@material-ui/icons/InfoOutline";
import LinkIcon from "@material-ui/icons/Link";
import PeopleIcon from "@material-ui/icons/People";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../../Components/Routing/NavLink";
import { formatMoney } from "../../Helpers/Utils";

import { accountsSelectAccount } from "../../Actions/accounts.js";

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

    fetchPaymentsHandler = accountId => {
        return () => {
            if (!this.props.paymentsLoading) {
                // select this account
                this.props.selectAccount(accountId);

                // check if we have a load callback for click events
                if (this.props.updateExternal) {
                    // fetch all payments for the account
                    this.props.updateExternal(this.props.user.id, accountId);
                }
            }
        };
    };

    render() {
        const account = this.props.account;

        if (account.status !== "ACTIVE") {
            return null;
        }

        const formattedBalance = this.props.hideBalance
            ? ""
            : formatMoney(account.balance ? account.balance.value : 0, true);

        const listItemProps = {};
        if (this.props.clickable) {
            listItemProps.button = true;
            listItemProps.onClick = this.fetchPaymentsHandler(account.id);
        }

        let avatarSub = null;
        if (this.props.isJoint) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <PeopleIcon />
                </Avatar>
            );
        } else if (this.props.isConnect) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <LinkIcon />
                </Avatar>
            );
        }

        return (
            <ListItem divider {...listItemProps}>
                <Avatar style={styles.bigAvatar}>
                    <LazyAttachmentImage
                        width={60}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={
                            account.avatar.image[0].attachment_public_uuid
                        }
                    />
                </Avatar>
                <div style={{ position: "absolute", left: 60, bottom: 4 }}>
                    {avatarSub}
                </div>
                <ListItemText
                    primary={account.description}
                    secondary={formattedBalance}
                />
                <ListItemSecondaryAction>
                    <IconButton
                        to={`/account-info/${account.id}`}
                        component={NavLink}
                    >
                        {this.props.accountsAccountId === account.id ? (
                            <KeyboardArrowRightIcon />
                        ) : (
                            <InfoIcon />
                        )}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        paymentsLoading: state.payments.loading,
        accountsAccountId: state.accounts.selectedAccount,
        hideBalance: state.options.hide_balance
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

AccountListItem.defaultProps = {
    clickable: true,
    denseMode: false,
    isJoint: false,
    isConnect: false
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListItem);

import React from "react";
import { connect } from "react-redux";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import KeyboardArrowRightIcon from "material-ui-icons/KeyboardArrowRight";
import InfoIcon from "material-ui-icons/InfoOutline";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../../Components/Routing/NavLink";
import { formatMoney } from "../../Helpers/Utils";
import Logger from "../../Helpers/Logger";

import { accountsSelectAccount } from "../../Actions/accounts.js";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
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
                // fetch all payments for the account
                this.props.updateExternal(this.props.user.id, accountId);
            }
        };
    };

    render() {
        const account = this.props.account;

        if (account.status !== "ACTIVE") {
            return null;
        }
        const formattedBalance = formatMoney(
            account.balance ? account.balance.value : 0
        );

        return (
            <ListItem
                button
                divider
                onClick={this.fetchPaymentsHandler(account.id)}
            >
                <Avatar style={styles.bigAvatar}>
                    <LazyAttachmentImage
                        width={60}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={
                            account.avatar.image[0].attachment_public_uuid
                        }
                    />
                </Avatar>
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
        accountsAccountId: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListItem);

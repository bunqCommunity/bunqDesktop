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
import AttachmentImage from "../../Components/AttachmentImage";
import { formatMoney } from "../../Helpers/Utils";

import { paymentsUpdate } from "../../Actions/payments.js";
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
                this.props.updatePayments(this.props.user.id, accountId);
            }
        };
    };

    render() {
        const account = this.props.account;

        if (account.status === "CANCELLED") {
            return null;
        }
        const formattedBalance = formatMoney(account.balance.value);

        return (
            <ListItem
                button
                divider
                onClick={this.fetchPaymentsHandler(account.id)}
            >
                <Avatar style={styles.bigAvatar}>
                    <AttachmentImage
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
                {this.props.accountsAccountId === account.id ? (
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={this.fetchPaymentsHandler(account.id)}
                        >
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                ) : null}
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
        updatePayments: (userId, accountId) =>
            dispatch(paymentsUpdate(BunqJSClient, userId, accountId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListItem);

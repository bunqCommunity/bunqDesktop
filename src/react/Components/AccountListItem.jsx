import React from "react";
import { connect } from "react-redux";
import { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";

import { paymentsUpdate } from "../Actions/payments.js";
import { accountsSelectAccount } from "../Actions/accounts.js";

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

    fetchPaymentsHandler(accountId) {
        return () => {
            if (!this.props.paymentsLoading) {
                // select this account
                this.props.selectAccount(accountId);
                // fetch all payments for the account
                this.props.updatePayments(accountId);
            }
        };
    }

    render() {
        const account = this.props.account;

        if (account.status === "CANCELLED") {
            return null;
        }
        return (
            <ListItem
                button
                divider
                onClick={this.fetchPaymentsHandler(account.id)}
            >
                <Avatar style={styles.bigAvatar}>
                    <img
                        width={60}
                        src={`/api/attachment/${account.avatar.image[0]
                            .attachment_public_uuid}`}
                    />
                </Avatar>
                <ListItemText
                    primary={account.description}
                    secondary={`€ ${account.balance.value}`}
                />
            </ListItem>
        );
    }
}

const mapStateToProps = state => {
    return {
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updatePayments: accountId => dispatch(paymentsUpdate(accountId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountListItem);

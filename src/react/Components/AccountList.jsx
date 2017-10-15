import React from "react";
import { connect } from "react-redux";
import { LinearProgress } from "material-ui/Progress";
import Divider from "material-ui/Divider";
import List, { ListSubheader } from "material-ui/List";

import AccountListItem from "./AccountListItem";

import { paymentsUpdate } from "../Actions/payments";

class AccountList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        const { accountsSelectedAccount, paymentsAccountId } = this.props;
        if (accountsSelectedAccount !== false) {
            // by default load payments for the selected account
            if (accountsSelectedAccount !== paymentsAccountId) {
                // fetch all payments for the account
                this.props.paymentsUpdate(accountsSelectedAccount);
            }
        }
    }

    render() {
        let accounts = [];
        let loadingContent = this.props.accountsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        if (this.props.accounts !== false) {
            accounts = this.props.accounts.map(account => (
                <AccountListItem account={account} />
            ));
        }

        return (
            <List>
                <ListSubheader>Accounts - {accounts.length}</ListSubheader>
                {loadingContent}
                <List>{accounts}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        paymentsUpdate: accountId => dispatch(paymentsUpdate(accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);

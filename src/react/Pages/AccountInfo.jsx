import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";
import ArrowBackIcon from "material-ui-icons/ArrowBack";

import CombinedList from "../Components/CombinedList";
import AccountCard from "./ApplicationInfo/AccountCard";

import { openSnackbar } from "../Actions/snackbar";
import { accountsUpdate } from "../Actions/accounts";
import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";

const styles = {
    btn: {},
    paper: {
        padding: 24,
        marginBottom: 16
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class AccountInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            this.props.accountsUpdate(this.props.user.id);

            const userId = this.props.user.id;
            const accountId = parseFloat(this.props.match.params.accountId);
            
            this.props.paymentsUpdate(userId, accountId);
            this.props.bunqMeTabsUpdate(userId, accountId);
            this.props.requestResponsesUpdate(userId, accountId);
            this.props.requestInquiriesUpdate(userId, accountId);
            this.props.masterCardActionsUpdate(userId, accountId);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { initialBunqConnect, user } = nextProps;
        const accountId = parseFloat(this.props.match.params.accountId);
        const nextAccountId = parseFloat(nextProps.match.params.accountId);

        if (initialBunqConnect && nextAccountId !== accountId) {
            this.props.accountsUpdate(user.id);

            this.props.paymentsUpdate(user.id, nextAccountId);
            this.props.bunqMeTabsUpdate(user.id, nextAccountId);
            this.props.requestResponsesUpdate(user.id, nextAccountId);
            this.props.requestInquiriesUpdate(user.id, nextAccountId);
            this.props.masterCardActionsUpdate(user.id, nextAccountId);
        }
    }

    render() {
        const { accounts } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        let accountInfo = false;
        accounts.map(account => {
            if (account.MonetaryAccountBank.id === accountId) {
                accountInfo = account.MonetaryAccountBank;
            }
        });

        let content = null;
        if (accountInfo !== false) {
            content = [
                <AccountCard
                    BunqJSClient={this.props.BunqJSClient}
                    openSnackbar={this.props.openSnackbar}
                    hideBalance={this.props.hideBalance}
                    account={accountInfo}
                />,
                <Paper>
                    <CombinedList
                        BunqJSClient={this.props.BunqJSClient}
                        initialBunqConnect={this.props.initialBunqConnect}
                    />
                </Paper>
            ];
        } else {
            content = (
                <Paper style={styles.paper}>
                    <Grid container spacing={24} justify={"center"}>
                        <Grid item xs={12}>
                            <div style={{ textAlign: "center" }}>
                                <CircularProgress />
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            );
        }

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Account Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8}>
                    {content}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        hideBalance: state.options.hide_balance,

        user: state.user.user,
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId)),
        accountsUpdate: userId => dispatch(accountsUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);

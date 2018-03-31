import React from "react";
import { translate } from "react-i18next";
import Redirect from "react-router-dom/Redirect";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";

import CombinedList from "../Components/CombinedList";
import AccountCard from "../Components/AccountCard";
import ButtonTranslate from "../Components/TranslationHelpers/Button";
import TypographyTranslate from "../Components/TranslationHelpers/Typography";

import { openSnackbar } from "../Actions/snackbar";
import { accountsUpdate, deactivateAccount } from "../Actions/accounts";
import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";

const styles = {
    btn: {},
    deactivateReason: {
        width: "100%",
        marginTop: 16
    },
    paper: {
        padding: 24,
        marginBottom: 16
    },
    paperList: {
        marginTop: 16
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
        this.state = {
            openDialog: false,
            deactivateReason: "I no longer need this account",
            deactivateActivated: false
        };
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

    handleReasonChange = event => {
        this.setState({ deactivateReason: event.target.value });
    };

    deactivateAccount = event => {
        // hide dialog
        this.toggleDeactivateDialog();
        // get the account id
        const accountId = parseFloat(this.props.match.params.accountId);
        // send a deactivation request
        this.props.deactivateAccount(
            this.props.user.id,
            accountId,
            this.state.deactivateReason
        );
        // trigger redirect back home
        this.setState({ deactivateActivated: true });
    };

    toggleDeactivateDialog = event => {
        this.setState({ openDialog: !this.state.openDialog });
    };

    render() {
        const { accounts, t } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        if (this.state.deactivateActivated) return <Redirect to="/" />;

        let accountInfo = false;
        accounts.map(account => {
            if (account.id === accountId) {
                accountInfo = account;
            }
        });

        let content = null;
        if (accountInfo !== false) {
            content = [
                <Dialog
                    open={this.state.openDialog}
                    onClose={this.toggleDeactivateDialog}
                >
                    <DialogTitle>{t("Cancel account")}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            {t("Are you sure you wish to cancel this account?")}
                        </DialogContentText>
                        <TextField
                            style={styles.deactivateReason}
                            value={this.state.deactivateReason}
                            onChange={this.handleReasonChange}
                            error={this.state.deactivateReason.length === 0}
                            helperText={t("Why are you closing the account?")}
                            placeholder={t("Reason")}
                        />
                    </DialogContent>

                    <DialogActions>
                        <ButtonTranslate
                            variant="raised"
                            onClick={this.toggleDeactivateDialog}
                            color="primary"
                            autoFocus
                        >
                            Cancel
                        </ButtonTranslate>
                        <ButtonTranslate
                            variant="raised"
                            onClick={this.deactivateAccount}
                            color="secondary"
                            disabled={this.state.deactivateReason.length === 0}
                        >
                            Agree
                        </ButtonTranslate>
                    </DialogActions>
                </Dialog>,
                <AccountCard
                    BunqJSClient={this.props.BunqJSClient}
                    openSnackbar={this.props.openSnackbar}
                    hideBalance={this.props.hideBalance}
                    toggleDeactivateDialog={this.toggleDeactivateDialog}
                    account={accountInfo}
                />,
                <Paper style={styles.paperList}>
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
                    <title>{`BunqDesktop - ${t("Account Info")}`}</title>
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
        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
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
        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),
        deactivateAccount: (userId, accountId, reason) =>
            dispatch(deactivateAccount(BunqJSClient, userId, accountId, reason))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(AccountInfo)
);

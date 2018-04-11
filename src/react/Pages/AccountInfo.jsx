import React from "react";
import { translate } from "react-i18next";
import Redirect from "react-router-dom/Redirect";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import CirclePicker from "react-color/lib/Circle";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import CombinedList from "../Components/CombinedList/CombinedList";
import AccountCard from "../Components/AccountCard";
import ButtonTranslate from "../Components/TranslationHelpers/Button";

import { openSnackbar } from "../Actions/snackbar";
import {
    accountsUpdate,
    accountsUpdateSettings,
    accountsDeactivate
} from "../Actions/accounts";
import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";

const styles = {
    textField: {
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
    },
    circlePicker: {
        padding: 8
    }
};

class AccountInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openDialog: false,
            deactivateReason: "I no longer need this account",
            deactivateActivated: false,

            openSettingsDialog: false,
            settingsColor: "#ffffff",
            settingsDescription: "",
            settingsDailyLimit: 1000
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

            const accountInfo = this.props.accounts.find(
                account => account.id === accountId
            );
            if (accountInfo) {
                // found account info, set settings
                this.setState({
                    settingsColor: accountInfo.color,
                    settingsDescription: accountInfo.description,
                    settingsDailyLimit: parseFloat(
                        accountInfo.daily_limit.value
                    )
                });
            }
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

    toggleDeactivateDialog = () =>
        this.setState({ openDialog: !this.state.openDialog });
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

    toggleSettingsDialog = () =>
        this.setState({ openSettingsDialog: !this.state.openSettingsDialog });
    handleColorChange = (color, event) =>
        this.setState({ settingsColor: color.hex });
    handleDescriptionChange = event =>
        this.setState({ settingsDescription: event.target.value });
    handleDailyLimitChange = event => {
        let inputLimit = event.target.value;
        if (inputLimit > 10000) inputLimit = 10000;
        if (inputLimit < 1) inputLimit = 1;

        this.setState({ settingsDailyLimit: inputLimit });
    };

    editAccount = event => {
        if (this.state.settingsDescription.length <= 0) return null;

        // hide dialog
        this.toggleSettingsDialog();
        // get the account id
        const accountId = parseFloat(this.props.match.params.accountId);
        // get the current account settings
        const accountInfo = this.props.accounts.find(
            account => account.id === accountId
        );

        // update settings
        this.props.updateSettings(this.props.user.id, accountInfo.id, {
            description: this.state.settingsDescription,
            daily_limit: {
                value: "" + this.state.settingsDailyLimit.toFixed(2),
                currency: "EUR"
            },
            setting: {
                color: this.state.settingsColor
            }
        });
    };

    render() {
        const { accounts, t } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        if (this.state.deactivateActivated) return <Redirect to="/" />;

        const accountInfo = accounts.find(account => account.id === accountId);

        let content = null;
        if (accountInfo !== false) {
            content = (
                <React.Fragment>
                    <Dialog
                        open={this.state.openDialog}
                        onClose={this.toggleDeactivateDialog}
                    >
                        <DialogTitle>{t("Cancel account")}</DialogTitle>

                        <DialogContent>
                            <DialogContentText>
                                {t(
                                    "Are you sure you wish to cancel this account?"
                                )}
                            </DialogContentText>
                            <TextField
                                style={styles.textField}
                                value={this.state.deactivateReason}
                                onChange={this.handleReasonChange}
                                error={this.state.deactivateReason.length === 0}
                                helperText={t(
                                    "Why are you closing the account?"
                                )}
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
                                disabled={
                                    this.props.accountsLoading ||
                                    this.state.deactivateReason.length === 0
                                }
                            >
                                Agree
                            </ButtonTranslate>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={this.state.openSettingsDialog}
                        onClose={this.toggleSettingsDialog}
                    >
                        <DialogTitle>{t("Edit account settings")}</DialogTitle>

                        <DialogContent>
                            <CirclePicker
                                onChange={this.handleColorChange}
                                color={this.state.settingsColor}
                                style={styles.circlePicker}
                            />
                            <TextField
                                style={styles.textField}
                                value={this.state.settingsDescription}
                                onChange={this.handleDescriptionChange}
                                error={
                                    this.state.settingsDescription.length === 0
                                }
                                placeholder={t("Account description")}
                            />
                            <TextField
                                style={styles.textField}
                                value={this.state.settingsDailyLimit}
                                onChange={this.handleDailyLimitChange}
                                type={"number"}
                                placeholder={t("Daily limit")}
                                inputProps={{
                                    min: 0,
                                    max: 10000
                                }}
                            />
                        </DialogContent>

                        <DialogActions>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.toggleSettingsDialog}
                                color="secondary"
                                autoFocus
                            >
                                Cancel
                            </ButtonTranslate>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.editAccount}
                                disabled={
                                    this.props.accountsLoading ||
                                    this.state.settingsDescription.length === 0
                                }
                                color="primary"
                            >
                                Update
                            </ButtonTranslate>
                        </DialogActions>
                    </Dialog>

                    <AccountCard
                        BunqJSClient={this.props.BunqJSClient}
                        openSnackbar={this.props.openSnackbar}
                        hideBalance={this.props.hideBalance}
                        toggleSettingsDialog={this.toggleSettingsDialog}
                        toggleDeactivateDialog={this.toggleDeactivateDialog}
                        account={accountInfo}
                    />

                    <Paper style={styles.paperList}>
                        <CombinedList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </React.Fragment>
            );
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
                    <Button onClick={this.props.history.goBack}>
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

        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),
        deactivateAccount: (userId, accountId, reason) =>
            dispatch(
                accountsDeactivate(BunqJSClient, userId, accountId, reason)
            ),
        updateSettings: (userId, accountId, settings) =>
            dispatch(
                accountsUpdateSettings(
                    BunqJSClient,
                    userId,
                    accountId,
                    settings
                )
            ),

        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(AccountInfo)
);

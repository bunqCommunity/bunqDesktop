import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

import RefreshIcon from "@material-ui/icons/Refresh";
import InvisibleIcon from "@material-ui/icons/VisibilityOff";
import VisibleIcon from "@material-ui/icons/Visibility";

import ScheduledPaymentItem from "./ScheduledPaymentItem";
import ScheduledPaymentsEditDialog from "./ScheduledPaymentsEditDialog";
import AccountList from "../../Components/AccountList/AccountList";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import { openSnackbar } from "../../Actions/snackbar";
import { scheduledPaymentsInfoUpdate } from "../../Actions/scheduled_payments";

const styles = {
    paper: {
        padding: 24,
        marginBottom: 16
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20
    }
};

class ScheduledPayments extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showInactive: false,
            deleteLoading: false,

            selectedPaymentIndex: false
        };
    }

    componentDidMount() {
        this.updateScheduledPayments();
    }

    updateScheduledPayments = (userId, accountId) => {
        if (!this.props.initialBunqConnect || this.props.scheduledPaymentsLoading) {
            return;
        }
        if (!userId) userId = this.props.user.id;
        if (!accountId) accountId = this.props.accountsAccountId;

        this.props.scheduledPaymentsInfoUpdate(userId, accountId);
    };
    deleteScheduledPayment = scheduledPaymentInfo => event => {
        if (this.state.deleteLoading === false) {
            this.setState({ deleteLoading: true });
            this.props.BunqJSClient.api.schedulePayment
                .delete(this.props.user.id, this.props.accountsAccountId, scheduledPaymentInfo.id)
                .then(result => {
                    this.updateScheduledPayments();
                    this.setState({ deleteLoading: false });
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        // likely a batch payment
                        this.props.BunqJSClient.api.schedulePaymentBatch
                            .delete(this.props.user.id, this.props.accountsAccountId, scheduledPaymentInfo.id)
                            .then(result => {
                                this.updateScheduledPayments();
                                this.setState({ deleteLoading: false });
                            })
                            .catch(err => {
                                this.setState({ deleteLoading: false });
                            });
                    } else {
                        // different error
                        this.setState({ deleteLoading: false });
                    }
                });
        }
    };

    toggleInactive = event => this.setState({ showInactive: !this.state.showInactive });

    validateForm = () => {};

    selectScheduledPayment = index => event => {
        this.setState({ selectedPaymentIndex: index });
    };

    render() {
        const t = this.props.t;

        const scheduledPayments = this.props.scheduledPayments.map((scheduledPayment, key) => {
            return (
                <ScheduledPaymentItem
                    t={t}
                    key={key}
                    BunqJSClient={this.props.BunqJSClient}
                    scheduledPayment={scheduledPayment}
                    showInactive={this.state.showInactive}
                    deleteLoading={this.state.deleteLoading || this.props.scheduledPaymentsLoading}
                    deleteScheduledPayment={this.deleteScheduledPayment}
                    selectScheduledPayment={this.selectScheduledPayment(key)}
                />
            );
        });

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Scheduled payments")}`}</title>
                </Helmet>

                <ScheduledPaymentsEditDialog
                    t={t}
                    BunqJSClient={this.props.BunqJSClient}
                    scheduledPayments={this.props.scheduledPayments}
                    selectedPaymentIndex={this.state.selectedPaymentIndex}
                    selectScheduledPayment={this.selectScheduledPayment}
                />

                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList
                            updateExternal={this.updateScheduledPayments}
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={8} md={10}>
                                <TranslateTypography variant="h5">Scheduled payments</TranslateTypography>
                            </Grid>

                            <Grid item xs={2} md={1}>
                                <IconButton onClick={() => this.toggleInactive()}>
                                    {this.state.showInactive ? <VisibleIcon /> : <InvisibleIcon />}
                                </IconButton>
                            </Grid>

                            <Grid item xs={2} md={1}>
                                {this.props.scheduledPaymentsLoading ? (
                                    <CircularProgress />
                                ) : (
                                    <IconButton onClick={() => this.updateScheduledPayments()}>
                                        <RefreshIcon />
                                    </IconButton>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    {this.props.scheduledPaymentsLoading ? <LinearProgress /> : null}
                                    {scheduledPayments.length > 0 ? (
                                        scheduledPayments
                                    ) : (
                                        <Typography variant="body1" style={{ textAlign: "center" }}>
                                            {t("No scheduled payments")}
                                        </Typography>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsAccountId: state.accounts.selected_account,

        scheduledPaymentsLoading: state.scheduled_payments.loading,
        scheduledPayments: state.scheduled_payments.scheduled_payments
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        scheduledPaymentsInfoUpdate: (userId, accountId) =>
            dispatch(scheduledPaymentsInfoUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(ScheduledPayments));

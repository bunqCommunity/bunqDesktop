import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import List from "material-ui/List";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import { LinearProgress, CircularProgress } from "material-ui/Progress";

import RefreshIcon from "material-ui-icons/Refresh";

import AccountList from "../../Components/AccountList/AccountList";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import { openSnackbar } from "../../Actions/snackbar";
import { scheduledPaymentsInfoUpdate } from "../../Actions/scheduled_payments";
import ScheduledPaymentItem from "./ScheduledPaymentItem";

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
            deleteLoading: false
        };
    }

    componentDidMount() {
        this.updateScheduledPayments();
    }

    updateScheduledPayments = () => {
        if (
            !this.props.initialBunqConnect ||
            this.props.scheduledPaymentsLoading
        ) {
            return;
        }
        this.props.scheduledPaymentsInfoUpdate(
            this.props.user.id,
            this.props.accountsAccountId
        );
    };

    deleteScheduledPayment = scheduledPaymentInfo => event => {
        if (this.state.deleteLoading === false) {
            this.setState({ deleteLoading: true });
            this.props.BunqJSClient.api.schedulePayment
                .delete(
                    this.props.user.id,
                    this.props.accountsAccountId,
                    scheduledPaymentInfo.id
                )
                .then(result => {
                    this.updateScheduledPayments();
                    this.setState({ deleteLoading: false });
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        // likely a batch payment
                        this.props.BunqJSClient.api.schedulePaymentBatch
                            .delete(
                                this.props.user.id,
                                this.props.accountsAccountId,
                                scheduledPaymentInfo.id
                            )
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

    toggleInactive = event =>
        this.setState({ showInactive: !this.state.showInactive });

    render() {
        const t = this.props.t;

        const scheduledPayments = this.props.scheduledPayments.map(
            (scheduledPayment, key) => {
                return (
                    <ScheduledPaymentItem
                        t={t}
                        key={key}
                        scheduledPayment={scheduledPayment}
                        showInactive={this.state.showInactive}
                        deleteLoading={
                            this.state.deleteLoading ||
                            this.props.scheduledPaymentsLoading
                        }
                        BunqJSClient={this.props.BunqJSClient}
                        deleteScheduledPayment={this.deleteScheduledPayment}
                    />
                );
            }
        );

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Scheduled payments")}`}</title>
                </Helmet>

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
                            <Grid item xs={10} md={11}>
                                <TranslateTypography variant={"headline"}>
                                    Scheduled payments
                                </TranslateTypography>
                            </Grid>

                            <Grid item xs={2} md={1}>
                                {this.props.scheduledPaymentsLoading ? (
                                    <CircularProgress />
                                ) : (
                                    <IconButton
                                        onClick={this.updateScheduledPayments}
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    {this.props.scheduledPaymentsLoading ? (
                                        <LinearProgress />
                                    ) : null}
                                    {scheduledPayments.length > 0 ? (
                                        scheduledPayments
                                    ) : (
                                        <Typography
                                            variant={"body2"}
                                            style={{ textAlign: "center" }}
                                        >
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
        accountsAccountId: state.accounts.selectedAccount,

        scheduledPaymentsLoading: state.scheduled_payments.loading,
        scheduledPayments: state.scheduled_payments.scheduled_payments
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        scheduledPaymentsInfoUpdate: (userId, accountId) =>
            dispatch(
                scheduledPaymentsInfoUpdate(BunqJSClient, userId, accountId)
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(ScheduledPayments)
);

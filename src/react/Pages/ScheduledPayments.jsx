import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import { LinearProgress, CircularProgress } from "material-ui/Progress";
import List, {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";

import RefreshIcon from "material-ui-icons/Refresh";

import LazyAttachmentImage from "../Components/AttachmentImage/LazyAttachmentImage";
import AccountList from "../Components/AccountList/AccountList";
import TranslateTypography from "../Components/TranslationHelpers/Typography";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";

import { openSnackbar } from "../Actions/snackbar";
import { scheduledPaymentsInfoUpdate } from "../Actions/scheduled_payments";
import scheduleTexts from "../Helpers/ScheduleTexts";
import { formatMoney } from "../Helpers/Utils";

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
        this.state = {};
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

    render() {
        const t = this.props.t;

        const scheduledPayments = this.props.scheduledPayments.map(
            (scheduledPayment, key) => {
                const scheduledPaymentInfo = scheduledPayment.ScheduledPayment;
                const schedule = scheduledPaymentInfo.schedule;

                const scheduleTextResult = scheduleTexts(
                    t,
                    schedule.time_start,
                    schedule.time_end,
                    schedule.recurrence_size,
                    schedule.recurrence_unit
                );

                const formattedPaymentAmount = formatMoney(
                    scheduledPaymentInfo.payment.amount.value
                );

                let imageUUID = false;
                if (scheduledPaymentInfo.payment.counterparty_alias.avatar) {
                    imageUUID =
                        scheduledPaymentInfo.payment.counterparty_alias.avatar
                            .image[0].attachment_public_uuid;
                }

                return (
                    <ListItem key={key}>
                        <Avatar style={styles.smallAvatar}>
                            <LazyAttachmentImage
                                width={50}
                                BunqJSClient={this.props.BunqJSClient}
                                imageUUID={imageUUID}
                            />
                        </Avatar>
                        <ListItemText
                            primary={scheduleTextResult.primary}
                            secondary={scheduleTextResult.secondary}
                        />

                        <ListItemSecondaryAction>
                            <MoneyAmountLabel
                                style={styles.moneyAmountLabel}
                                info={scheduledPaymentInfo.payment}
                                type="payment"
                            >
                                {formattedPaymentAmount}
                            </MoneyAmountLabel>
                        </ListItemSecondaryAction>
                    </ListItem>
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
                                    {scheduledPayments}
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

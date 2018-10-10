import React from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ButtonTranslate from "../../Components/TranslationHelpers/Button";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import SchedulePaymentForm from "../../Components/FormFields/SchedulePaymentForm";
import AttachmentImage from "../../Components/AttachmentImage/AttachmentImage";

import { scheduledPaymentUpdate } from "../../Actions/scheduled_payments";

const styles = {
    textField: {
        width: "100%"
    },
    smallAvatar: {
        width: 60,
        height: 60
    },
    descriptionTextField: {
        width: "100%",
        marginBottom: 16
    }
};

class ScheduledPaymentsEditDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedPaymentIndex: false,

            description: "",
            amount: 0,
            recurrenceSize: "",
            recurrenceUnit: "",
            scheduleEndDate: "",
            scheduleStartDate: null
        };
    }

    componentWillReceiveProps(newProps) {
        // track changes
        if (newProps.selectedPaymentIndex !== this.state.selectedPaymentIndex) {
            const info = this.props.scheduledPayments[newProps.selectedPaymentIndex];
            if (!info) {
                this.setState({ selectedPaymentIndex: false });
                return false;
            }

            const scheduledPayment = info.ScheduledPayment;

            this.setState({
                selectedPaymentIndex: newProps.selectedPaymentIndex,

                description: scheduledPayment.payment.description,
                amount: parseFloat(scheduledPayment.payment.amount.value) * -1,
                recurrenceSize: scheduledPayment.schedule.recurrence_size,
                recurrenceUnit: scheduledPayment.schedule.recurrence_unit,
                scheduleEndDate: scheduledPayment.schedule.time_end
                    ? new Date(scheduledPayment.schedule.time_end)
                    : null,
                scheduleStartDate: new Date(scheduledPayment.schedule.time_next)
            });
        }
    }

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            this.validateForm
        );
    };
    handleAmountChange = valueObject => {
        let amount = valueObject.formattedValue.length > 0 ? valueObject.floatValue : 0;
        if (amount < 0) amount = amount * -1;

        this.setState(
            {
                amount: amount
            },
            this.validateForm
        );
    };
    handleChangeDirect = name => value => {
        this.setState(
            {
                [name]: value
            },
            this.validateForm
        );
    };

    closeDialog = event => {
        // close the dialog by deselecting this payment
        this.props.selectScheduledPayment(false)(event);
    };

    editPayment = () => {
        const { amount, description, recurrenceUnit, recurrenceSize, scheduleEndDate, scheduleStartDate } = this.state;

        let scheduledPayment = this.props.scheduledPayments[this.props.selectedPaymentIndex];
        if (!scheduledPayment) return false;
        scheduledPayment = scheduledPayment.ScheduledPayment;

        // create a valid payment object with our updated avlues
        const paymentInfo = {
            counterparty_alias: {
                type: "IBAN",
                value: scheduledPayment.payment.counterparty_alias.iban,
                name: scheduledPayment.payment.counterparty_alias.display_name
            },
            description: description,
            amount: {
                value: amount + "",
                currency: "EUR"
            }
        };

        // setup the new schedule object
        const scheduleInfo = {
            recurrence_size: parseInt(recurrenceUnit !== "ONCE" ? recurrenceSize : 1),
            recurrence_unit: recurrenceUnit,
            time_start: format(scheduleStartDate, "YYYY-MM-dd HH:mm:ss")
        };
        if (scheduleEndDate) {
            scheduleInfo.time_end = format(scheduleEndDate, "YYYY-MM-dd HH:mm:ss");
        }

        this.props.scheduledPaymentUpdate(
            this.props.user.id,
            scheduledPayment.monetary_account_id,
            scheduledPayment.id,
            paymentInfo,
            scheduleInfo
        );
        this.closeDialog();
    };

    render() {
        const { t, BunqJSClient, scheduledPayments } = this.props;
        const { selectedPaymentIndex } = this.state;
        const open = selectedPaymentIndex !== false;
        const isValid = this.state.description.length <= 140;

        if (!open) return null;
        if (!scheduledPayments[selectedPaymentIndex]) return null;

        const scheduledPayment = scheduledPayments[selectedPaymentIndex].ScheduledPayment;

        // check if there is a counterparty with an avatar
        let imageUUID = false;
        if (scheduledPayment.payment.counterparty_alias.avatar) {
            const counterPartyAvatar = scheduledPayment.payment.counterparty_alias.avatar;

            if (counterPartyAvatar.image) {
                imageUUID = counterPartyAvatar.image[0].attachment_public_uuid;
            }
        }

        return (
            <Dialog open={open} onClose={this.closeDialog}>
                <DialogTitle>{t("Edit scheduled payment")}</DialogTitle>

                <DialogContent>
                    <ListItem>
                        {imageUUID && (
                            <Avatar style={styles.smallAvatar}>
                                <AttachmentImage height={60} BunqJSClient={BunqJSClient} imageUUID={imageUUID} />
                            </Avatar>
                        )}

                        <ListItemText
                            primary={scheduledPayment.payment.counterparty_alias.display_name}
                            secondary={scheduledPayment.payment.counterparty_alias.iban}
                        />
                    </ListItem>

                    <TextField
                        label={t("Description")}
                        style={styles.descriptionTextField}
                        value={this.state.description}
                        onChange={this.handleChange("description")}
                        error={!isValid}
                        placeholder={t("Description")}
                        multiline={true}
                    />

                    <SchedulePaymentForm
                        t={t}
                        schedulePayment={true}
                        recurrenceUnit={this.state.recurrenceUnit}
                        recurrenceSize={this.state.recurrenceSize}
                        scheduleEndDate={this.state.scheduleEndDate}
                        scheduleStartDate={this.state.scheduleStartDate}
                        handleChangeDirect={this.handleChangeDirect}
                        handleChange={this.handleChange}
                    />

                    <MoneyFormatInput
                        id="amount"
                        value={this.state.amount}
                        onValueChange={this.handleAmountChange}
                        onKeyPress={ev => {
                            if (ev.key === "Enter" && isValid) {
                                this.editPayment();
                                ev.preventDefault();
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <ButtonTranslate variant="raised" onClick={this.closeDialog} color="secondary">
                        Cancel
                    </ButtonTranslate>
                    {this.props.limitedPermissions ? null : (
                        <ButtonTranslate
                            variant="raised"
                            onClick={this.editPayment}
                            disabled={!isValid || this.props.scheduledPaymentsLoading}
                            color="primary"
                        >
                            Update
                        </ButtonTranslate>
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        scheduledPaymentsLoading: state.scheduled_payments.loading,
        scheduledPayments: state.scheduled_payments.scheduled_payments,
        selectedAccount: state.accounts.selected_account
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        scheduledPaymentUpdate: (...params) => dispatch(scheduledPaymentUpdate(BunqJSClient, ...params))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduledPaymentsEditDialog);

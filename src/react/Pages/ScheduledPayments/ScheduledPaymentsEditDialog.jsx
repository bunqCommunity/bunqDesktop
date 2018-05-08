import React from "react";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";

import ButtonTranslate from "../../Components/TranslationHelpers/Button";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import SchedulePaymentForm from "../../Pages/Pay/SchedulePaymentForm";

const styles = {
    textField: {
        width: "100%"
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
            scheduleEndDateError: false,
            scheduleStartDate: ""
        };
    }

    componentWillReceiveProps(newProps) {
        // track changes
        if (newProps.selectedPaymentIndex !== this.state.selectedPaymentIndex) {
            const info = this.props.scheduledPayments[
                newProps.selectedPaymentIndex
            ];
            if (!info) {
                this.setState({ selectedPaymentIndex: false });
                return false;
            }

            const scheduledPayment = info.ScheduledPayment;

            this.setState({
                selectedPaymentIndex: newProps.selectedPaymentIndex,

                description: scheduledPayment.payment.description,
                amount: parseFloat(scheduledPayment.payment.amount.value),
                recurrenceSize: scheduledPayment.schedule.recurrence_size,
                recurrenceUnit: scheduledPayment.schedule.recurrence_unit,
                scheduleEndDate: scheduledPayment.schedule.time_end,
                scheduleStartDate: scheduledPayment.schedule.time_start
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
    handleChangeFormatted = valueObject => {
        this.setState(
            {
                amount:
                    valueObject.formattedValue.length > 0
                        ? valueObject.floatValue
                        : ""
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

    render() {
        const { t } = this.props;
        const { selectedPaymentIndex } = this.state;
        const open = selectedPaymentIndex !== false;

        if (!open) return null;

        return (
            <Dialog open={open} onClose={this.closeDialog}>
                <DialogTitle>{t("Edit scheduled payment")}</DialogTitle>

                <DialogContent>
                    <TextField
                        label={t("Description")}
                        style={styles.descriptionTextField}
                        value={this.state.description}
                        onChange={this.handleChange("description")}
                        error={this.state.description.length > 140}
                        placeholder={t("Description")}
                    />

                    <SchedulePaymentForm
                        t={t}
                        schedulePayment={true}
                        recurrenceUnit={this.state.recurrenceUnit}
                        recurrenceSize={this.state.recurrenceSize}
                        scheduleEndDate={this.state.scheduleEndDate}
                        scheduleStartDate={this.state.scheduleStartDate}
                        scheduleEndDateError={this.state.scheduleEndDateError}
                        handleChangeDirect={this.handleChangeDirect}
                        handleChange={this.handleChange}
                    />

                    <MoneyFormatInput
                        id="amount"
                        value={this.state.amount}
                        onValueChange={this.handleChangeFormatted}
                        // onKeyPress={ev => {
                        //     if (
                        //         ev.key === "Enter" &&
                        //         this.state.validForm
                        //     ) {
                        //         this.openModal();
                        //         ev.preventDefault();
                        //     }
                        // }}
                    />
                </DialogContent>

                <DialogActions>
                    <ButtonTranslate
                        variant="raised"
                        onClick={this.closeDialog}
                        color="secondary"
                    >
                        Cancel
                    </ButtonTranslate>
                    <ButtonTranslate
                        variant="raised"
                        onClick={this.editAccount}
                        disabled={
                            this.props.accountsLoading ||
                            this.state.description.length === 0
                        }
                        color="primary"
                    >
                        Update
                    </ButtonTranslate>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(
    ScheduledPaymentsEditDialog
);

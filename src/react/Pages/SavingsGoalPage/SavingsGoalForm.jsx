import React from "react";
import { Field, reduxForm } from "redux-form";
import Grid from "@material-ui/core/Grid";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import { required, maxLength, minValue, minArrayLength } from "../../Components/ReduxForm/Validators";
import renderTextField from "../../Components/ReduxForm/Fields/renderTextField";
import renderDateTimePicker from "../../Components/ReduxForm/Fields/renderDateTimePicker";
import renderAmountField from "../../Components/ReduxForm/Fields/renderAmountField";
import renderAccountsPicker from "../../Components/ReduxForm/Fields/renderAccountsPicker";
import renderColorPickerGradient from "../../Components/ReduxForm/Fields/renderColorPickerGradient";
import renderAmountFieldCustom from "./renderAmountFieldCustom";

const styles = {
    updateButton: {
        width: "100%"
    },
    title: {
        marginBottom: 8
    },
    textField: {
        width: "100%"
    },
    amountField: {
        fontSize: 24
    },
    bottomMargin: {
        marginBottom: 8
    }
};

const maxLength500Handler = maxLength(500);
const maxLength100Handler = maxLength(100);
const minValue0Handler = minValue(0);
const minArrayLength0Handler = minArrayLength(1, "account");

let SavingsGoalForm = props => {
    const { t, handleSubmit, pristine, submitting, valid } = props;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12} style={styles.bottomMargin}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="title"
                    label="Title"
                    component={renderTextField}
                    validate={[required, maxLength100Handler]}
                />
            </Grid>

            <Grid item xs={12} style={styles.bottomMargin}>
                <Field
                    fullWidth
                    multiline
                    rows="2"
                    style={styles.textField}
                    name="description"
                    label="Description"
                    component={renderTextField}
                    validate={[maxLength500Handler]}
                />
            </Grid>

            <Grid item xs={12} sm={6} style={styles.bottomMargin}>
                <Field
                    style={styles.amountField}
                    name="goal_amount"
                    label="Goal amount"
                    component={renderAmountField}
                    validate={[required, minValue0Handler]}
                />
            </Grid>
            <Grid item xs={12} sm={6} style={styles.bottomMargin}>
                <Field
                    style={styles.amountField}
                    name="start_amount"
                    label="Start amount"
                    component={renderAmountFieldCustom}
                    validate={[minValue0Handler]}
                />
            </Grid>

            <Grid item xs={12} sm={6} style={styles.bottomMargin}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="started"
                    label="Start date"
                    component={renderDateTimePicker}
                    validate={[required]}
                />
            </Grid>
            <Grid item xs={12} sm={6} style={styles.bottomMargin}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="expired"
                    label="Expiry date"
                    component={renderDateTimePicker}
                />
            </Grid>

            <Grid item xs={12} style={styles.bottomMargin}>
                <Field
                    fullWidth
                    name="color"
                    label="Color"
                    component={renderColorPickerGradient}
                    validate={[required]}
                />
            </Grid>

            <Grid item xs={12} style={styles.bottomMargin}>
                <Field
                    name="account_ids"
                    label="Accounts"
                    component={renderAccountsPicker}
                    validate={[minArrayLength0Handler]}
                />
            </Grid>

            <Grid item xs={12}>
                <TranslateButton
                    style={styles.updateButton}
                    disabled={pristine || submitting || !valid}
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                >
                    Update
                </TranslateButton>
            </Grid>
        </Grid>
    );
};

SavingsGoalForm = reduxForm({
    form: "savingsGoal",
    validate: values => {
        const errors = {};
        if (values.goal_amount && values.start_amount && values.goal_amount < values.start_amount) {
            errors.start_amount = window.t("Start amount can't be more than the goal amount");
        }
        return errors;
    }
})(SavingsGoalForm);

export default SavingsGoalForm;

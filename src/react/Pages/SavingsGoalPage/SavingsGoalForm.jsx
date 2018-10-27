import React from "react";
import { Field, reduxForm } from "redux-form";
import Grid from "@material-ui/core/Grid";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import renderTextField from "../../Components/ReduxForm/Fields/renderTextField";
import renderDateTimePicker from "../../Components/ReduxForm/Fields/renderDateTimePicker";
import { required, maxLength, minValue } from "../../Components/ReduxForm/Validators";
import renderAmountField from "../../Components/ReduxForm/Fields/renderAmountField";

const styles = {
    title: {
        marginBottom: 8
    },
    textField: {
        width: "100%"
    },
    amountField: {
        color: "#000000",
        fontSize: 24
    }
};

let SavingsGoalForm = props => {
    const { t, handleSubmit, pristine, submitting, valid } = props;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="title"
                    label="Title"
                    component={renderTextField}
                    validate={[required, maxLength(100)]}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="started"
                    label="Start date"
                    component={renderDateTimePicker}
                    validate={[required]}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="ended"
                    label="End date"
                    component={renderDateTimePicker}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Field
                    fullWidth
                    style={styles.textField}
                    name="expired"
                    label="Expiry date"
                    component={renderDateTimePicker}
                />
            </Grid>

            <Grid item xs={12}>
                <Field
                    fullWidth
                    margin="normal"
                    style={styles.textField}
                    name="description"
                    label="Description"
                    component={renderTextField}
                    validate={[required, maxLength(500)]}
                    multiline
                    rows="2"
                />
            </Grid>

            {/*<Grid item xs={12} sm={6}>*/}
                {/*<Field*/}
                    {/*style={styles.amountField}*/}
                    {/*name="goal_amount"*/}
                    {/*label="Goal amount"*/}
                    {/*component={renderAmountField}*/}
                    {/*validate={[required, minValue(1)]}*/}
                {/*/>*/}
            {/*</Grid>*/}

            <Grid item xs={12}>
                <TranslateButton
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
    form: "savingsGoal"
})(SavingsGoalForm);

export default SavingsGoalForm;

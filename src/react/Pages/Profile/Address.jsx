import React from "react";
import { Field } from "redux-form";
import Grid from "@material-ui/core/Grid";

import renderTextField from "../../Components/ReduxForm/Fields/renderTextField";
import { required } from "../../Components/ReduxForm/Validators";

const styles = {
    textField: {
        width: "100%"
    }
};

export default props => {
    const { t, subAddressKey } = props;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.city`}
                    label="City"
                    validate={[required]}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.country`}
                    label="Country"
                    validate={[required]}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.house_number`}
                    label="House number"
                    validate={[required]}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.postal_code`}
                    label="Postal code"
                    validate={[required]}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.po_box`}
                    label="PO box"
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    style={styles.textField}
                    component={renderTextField}
                    name={`${subAddressKey}.street`}
                    label="Street"
                    validate={[required]}
                />
            </Grid>
        </Grid>
    );
};

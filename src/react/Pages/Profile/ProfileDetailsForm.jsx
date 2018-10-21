import React from "react";
import { Field } from "redux-form";
import Grid from "@material-ui/core/Grid";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import Address from "./Address";

import renderTextField from "../../Components/ReduxForm/Fields/renderTextField";
import { required } from "../../Components/ReduxForm/Validators";

const styles = {
    title: {
        marginBottom: 8
    },
    textField: {
        width: "100%"
    }
};

export default props => {
    const { t, handleSubmit, pristine, submitting, valid } = props;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <Field
                    fullWidth
                    margin="normal"
                    style={styles.textField}
                    name="public_nick_name"
                    label="Public nick name"
                    component={renderTextField}
                    validate={[required]}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TranslateTypography variant="h6" style={styles.title}>
                    Main address
                </TranslateTypography>
                <Address t={t} subAddressKey="address_main" />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TranslateTypography variant="h6" style={styles.title}>
                    Postal address
                </TranslateTypography>
                <Address t={t} subAddressKey="address_postal" />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TranslateButton
                    disabled={pristine || submitting || !valid}
                    onClick={handleSubmit}
                    variant="contained"
                    color={"primary"}
                >
                    Update
                </TranslateButton>
            </Grid>
        </Grid>
    );
};

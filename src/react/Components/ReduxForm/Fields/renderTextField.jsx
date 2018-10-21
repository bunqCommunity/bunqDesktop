import React from "react";
import { translate } from "react-i18next";
import TextField from "@material-ui/core/TextField";

const renderTextField = ({ t, i18n, tReady, input, label, meta: { touched, error }, ...custom }) => {
    if (error && !custom.helperText) {
        custom.helperText = error;
    }
    return <TextField label={label && t(label)} error={touched && !!error} {...input} {...custom} />;
};

export default translate("translations")(renderTextField);

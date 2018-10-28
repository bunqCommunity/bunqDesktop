import React from "react";
import { translate } from "react-i18next";
import TextField from "@material-ui/core/TextField";

const renderTextField = ({ t, i18n, tReady, input, label, meta: { touched, error }, ...custom }) => {
    if (error && !custom.helperText) {
        custom.helperText = error;
    }

    const labelValue = label && t(label);
    const errorValue = touched && !!error;

    return <TextField key={label} label={labelValue} error={errorValue} {...input} {...custom} />;
};

export default translate("translations")(renderTextField);

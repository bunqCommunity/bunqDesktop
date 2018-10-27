import React from "react";
import { translate } from "react-i18next";
import ColorPicker from "../../FormFields/ColorPicker";

const renderTextField = ({ t, i18n, tReady, input, label, meta: { touched, error }, ...custom }) => {
    if (error && !custom.helperText) {
        custom.helperText = error;
    }
    return <ColorPicker label={label && t(label)} error={touched && !!error} {...input} {...custom} />;
};

export default translate("translations")(renderTextField);

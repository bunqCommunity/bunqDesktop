import React from "react";
import { translate } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

const renderTextField = ({ t, i18n, tReady, input, label, style = {}, meta: { touched, error }, ...custom }) => {
    const labelValue = label && t(label);
    const errorValue = touched && !!error;

    return (
        <FormControl error={errorValue} style={style}>
            <InputLabel key={`inputlabel-${label}`}>{labelValue}</InputLabel>
            <Input key={`input-${label}`} {...input} {...custom} />
            {error && <FormHelperText key={`formhelper-${label}`}>{error}</FormHelperText>}
        </FormControl>
    );
    // return <TextField key={label} label={labelValue} error={errorValue} />;
};

export default translate("translations")(renderTextField);

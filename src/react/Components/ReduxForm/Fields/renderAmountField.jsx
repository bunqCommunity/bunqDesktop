import React from "react";
import { translate } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import Typography from "../../TranslationHelpers/Typography";
import MoneyFormatInput from "../../FormFields/MoneyFormatInput";

const styles = {
    formControl: {
        marginBottom: 10
    }
};

const handleChangeFormatted = onChange => valueObject => {
    onChange(valueObject.formattedValue.length > 0 ? valueObject.floatValue : "");
};

const renderTextField = ({ t, i18n, tReady, input, formStyle = {}, label, meta: { touched, error }, ...custom }) => {
    const { onChange, ...restInputProps } = input;

    const labelComponent = label && label.length > 0 ? <Typography variant="body2">{label}</Typography> : null;

    return (
        <FormControl style={styles.formControl} style={formStyle} error={touched && !!error} fullWidth>
            {labelComponent}
            <MoneyFormatInput onValueChange={handleChangeFormatted(onChange)} {...restInputProps} {...custom} />
        </FormControl>
    );
};

export default translate("translations")(renderTextField);

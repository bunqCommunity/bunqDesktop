import React from "react";
import { translate } from "react-i18next";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import Typography from "@material-ui/core/Typography";

import { getUTCDate, UTCDateToLocalDate } from "../../../Functions/Utils";

const styles = {
    dateTimePicker: {}
};

const renderDateTimePicker = ({ t, i18n, tReady, input, label, meta: { touched, error }, style, ...custom }) => {
    let errorLabel = null;
    if (error && !custom.helperText) {
        errorLabel = (
            <Typography variant="body2" style={{ color: "#ec2616" }}>
                {error}
            </Typography>
        );
    }
    const { onChange, value, ...filteredInputProps } = input;
    const componentStyle = {
        ...styles.dateTimePicker,
        ...style
    };

    const fixedUtcDate = value && value !== null && value !== "" ? UTCDateToLocalDate(value) : null;

    const overWrittenOnChange = date => {
        if (date) {
            onChange(getUTCDate(date));
        } else {
            onChange(null);
        }
    };

    return (
        <React.Fragment>
            <DateTimePicker
                key={label}
                format="MMMM dd, yyyy HH:mm"
                cancelLabel={t("Cancel")}
                clearLabel={t("Clear")}
                okLabel={t("Ok")}
                todayLabel={t("Today")}
                ampm={false}
                clearable
                value={fixedUtcDate}
                onChange={overWrittenOnChange}
                label={label && t(label)}
                style={componentStyle}
                {...filteredInputProps}
                {...custom}
            />
            {errorLabel}
        </React.Fragment>
    );
};

export default translate("translations")(renderDateTimePicker);

import React from "react";
import { translate } from "react-i18next";
import DateTimePicker from "material-ui-pickers/DateTimePicker";

import { getUTCDate, UTCDateToLocalDate } from "../../../Helpers/Utils";

const styles = {
    dateTimePicker: {}
};

const renderDateTimePicker = ({ t, i18n, tReady, input, label, meta: { touched, error }, style, ...custom }) => {
    if (error && !custom.helperText) {
        custom.invalidLabel = error;
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
        <DateTimePicker
            format="MMMM dd, YYYY HH:mm"
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
    );
};

export default translate("translations")(renderDateTimePicker);

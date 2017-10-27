import React from "react";
import NumberFormat from "react-number-format";
import Input from "material-ui/Input";

const PhoneFormatInput = props => {
    return (
        <NumberFormat
            required
            fullWidth
            margin="normal"
            format="+####################"
            customInput={Input}
            {...props}
        />
    );
};

export default PhoneFormatInput;

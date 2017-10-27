import React from "react";
import NumberFormat from "react-number-format";
import Input from "material-ui/Input";
import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../../Helpers/Utils";

const MoneyFormatInput = (props) => {
    return (
        <NumberFormat
            required
            fullWidth
            id="amount"
            margin="normal"
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator={preferedDecimalSeparator}
            thousandSeparator={preferedThousandSeparator}
            prefix={"€"}
            customInput={Input}
            {...props}
        />
    );
};

export default MoneyFormatInput;

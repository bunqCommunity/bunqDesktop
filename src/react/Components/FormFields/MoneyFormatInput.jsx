import React from "react";
import NumberFormat from "react-number-format";
import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../../Helpers/Utils";

const MoneyFormatInput = (props) => {
    return (
        <NumberFormat
            required
            fullWidth
            margin="normal"
            placeholder="€ 0.00"
            className="money-input"
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator={preferedDecimalSeparator}
            thousandSeparator={preferedThousandSeparator}
            prefix={"€ "}
           // customInput={Input}
            {...props}
        />
    );
};

export default MoneyFormatInput;

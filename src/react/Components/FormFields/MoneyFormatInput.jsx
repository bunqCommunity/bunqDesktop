import React from "react";
import NumberFormat from "react-number-format";
import { withTheme } from "@material-ui/core/styles";

import { preferedThousandSeparator, preferedDecimalSeparator } from "../../Functions/Utils";

const MoneyFormatInput = props => {
    const { style, ...otherProps } = props;

    const mergedStyle = {
        fontSize: 30,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        ...props.theme.styles.moneyInput,
        ...style
    };

    return (
        <NumberFormat
            min={0}
            prefix="€ "
            margin="normal"
            decimalScale={2}
            placeholder="€ 0.00"
            className="money-input"
            fixedDecimalScale={true}
            style={mergedStyle}
            decimalSeparator={preferedDecimalSeparator}
            thousandSeparator={preferedThousandSeparator}
            {...otherProps}
        />
    );
};

export default withTheme()(MoneyFormatInput);

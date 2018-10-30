import React from "react";
import NumberFormat from "react-number-format";
import { preferedThousandSeparator, preferedDecimalSeparator } from "../../Helpers/Utils";

import { withTheme } from "@material-ui/core/styles";

class MoneyFormatInput extends React.Component {
    render() {
        const { style, ...otherProps } = this.props;

        return (
            <NumberFormat
                min={0}
                prefix="€ "
                margin="normal"
                decimalScale={2}
                placeholder="€ 0.00"
                className="money-input"
                fixedDecimalScale={true}
                style={{
                    fontSize: 30,
                    ...this.props.theme.styles.moneyInput,
                    ...style
                }}
                decimalSeparator={preferedDecimalSeparator}
                thousandSeparator={preferedThousandSeparator}
                {...otherProps}
            />
        );
    }
}

export default withTheme()(MoneyFormatInput);

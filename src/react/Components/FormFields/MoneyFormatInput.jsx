import React from "react";
import NumberFormat from "react-number-format";
import { preferedThousandSeparator, preferedDecimalSeparator } from "../../Helpers/Utils";

import { withTheme } from "@material-ui/core/styles";

class MoneyFormatInput extends React.Component {
    render() {
        return (
            <NumberFormat
                required
                margin="normal"
                placeholder="€ 0.00"
                min={0}
                style={{
                    fontSize: 30,
                    ...this.props.theme.styles.moneyInput
                }}
                className="money-input"
                decimalScale={2}
                fixedDecimalScale={true}
                decimalSeparator={preferedDecimalSeparator}
                thousandSeparator={preferedThousandSeparator}
                prefix={"€ "}
                {...this.props}
            />
        );
    }
}

export default withTheme()(MoneyFormatInput);

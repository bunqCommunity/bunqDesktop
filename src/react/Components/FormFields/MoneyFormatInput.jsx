import React from "react";
import NumberFormat from "react-number-format";
import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../../Helpers/Utils";

import { withTheme } from "material-ui/styles";

class MoneyFormatInput extends React.Component {
    render() {
        return (
            <NumberFormat
                required
                margin="normal"
                placeholder="€ 0.00"
                style={{
                    fontSize: 30,
                    ...this.props.theme.styles.moneyInput,
                }}
                className="money-input"
                decimalScale={2}
                fixedDecimalScale={true}
                decimalSeparator={preferedDecimalSeparator}
                thousandSeparator={preferedThousandSeparator}
                prefix={"€ "}
            />
        );
    }
}

export default withTheme()(MoneyFormatInput);

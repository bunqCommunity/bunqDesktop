import React from "react";
import NumberFormat from "react-number-format";
import TextField from "material-ui/TextField";
import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../../Helpers/Utils";

import { withTheme } from "material-ui/styles";

class MoneyFormatInputDefault extends React.Component {
    NumberFormatCustom = props => {
        const { inputRef, fontSize = 24, ...other } = props;

        return (
            <NumberFormat
                ref={inputRef}
                required
                margin="normal"
                placeholder="€ 0.00"
                style={{
                    fontSize: fontSize,
                    ...this.props.theme.styles.moneyInput
                }}
                decimalScale={2}
                fixedDecimalScale={true}
                decimalSeparator={preferedDecimalSeparator}
                thousandSeparator={preferedThousandSeparator}
                {...other}
            />
        );
    };

    render() {
        return (
            <TextField
                InputProps={{
                    inputComponent: this.NumberFormatCustom
                }}
                {...this.props}
            />
        );
    }
}

export default withTheme()(MoneyFormatInputDefault);

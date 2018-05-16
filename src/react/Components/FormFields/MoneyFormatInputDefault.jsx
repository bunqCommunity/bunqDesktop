import React from "react";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../../Helpers/Utils";

import { withTheme } from "@material-ui/core/styles";

class MoneyFormatInputDefault extends React.Component {
    NumberFormatCustom = props => {
        const { inputRef, fontSize, ...other } = props;

        return (
            <NumberFormat
                ref={inputRef}
                required
                margin="normal"
                placeholder="€ 0.00"
                style={{
                    ...this.props.theme.styles.moneyInput,
                    fontSize: fontSize
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

MoneyFormatInputDefault.defaultProps = {
    fontSize: 24
}

export default withTheme()(MoneyFormatInputDefault);

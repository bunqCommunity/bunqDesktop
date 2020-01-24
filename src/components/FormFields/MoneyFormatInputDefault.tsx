import React from "react";
import NumberFormat from "react-number-format";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import { preferedThousandSeparator, preferedDecimalSeparator } from "~functions/Utils";

import { withTheme } from "@material-ui/core/styles";

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class MoneyFormatInputDefault extends React.Component<IProps> {
    state: IState;

    static defaultProps = {
        fontSize: 24
    };

    NumberFormatCustom = props => {
        const { inputRef, fontSize, ...other } = props;

        return (
            <NumberFormat
                ref={inputRef}
                required
                margin="normal"
                placeholder="€ 0.00"
                decimalScale={2}
                fixedDecimalScale={true}
                style={{
                    ...this.props.theme.styles.moneyInput,
                    fontSize: fontSize
                }}
                decimalSeparator={preferedDecimalSeparator}
                thousandSeparator={preferedThousandSeparator}
                {...other}
            />
        );
    };

    render() {
        return (
            <FormControl>
                <Input inputComponent={this.NumberFormatCustom} {...this.props} />
            </FormControl>
        );
    }
}

export default withTheme()(MoneyFormatInputDefault);

import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { setAmountFilterAmount, setAmountFilterType, clearAmountFilter } from "~actions/filters";
import { AppWindow } from "~app";
import { AppDispatch, ReduxState } from "~store/index";

interface IProps {
    style: CSSProperties;
    t: AppWindow["t"];
}

interface IState {
    [key: string]: any;
}

class AmountFilter extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    handleAmountChange = event => {
        this.props.setAmountFilterAmount(event.target.value);
    };
    handleTypeChange = event => {
        this.props.setAmountFilterType(event.target.value);
    };

    render() {
        const t = this.props.t;
        return (
            <>
                <TextField
                    label={t("Filter by amount")}
                    style={this.props.style}
                    value={this.props.amountFilterAmount}
                    onChange={this.handleAmountChange}
                    type="number"
                />
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select value={this.props.amountFilterType} onChange={this.handleTypeChange}>
                        <MenuItem value="EQUALS">{`=`}</MenuItem>
                        <MenuItem value="LESS">{`<`}</MenuItem>
                        <MenuItem value="MORE">{`>`}</MenuItem>
                    </Select>
                </FormControl>
            </>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        amountFilterAmount: state.amountFilter.amount,
        amountFilterType: state.amountFilter.type
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        setAmountFilterAmount: amount => dispatch(setAmountFilterAmount(amount)),
        setAmountFilterType: amount => dispatch(setAmountFilterType(amount))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmountFilter);

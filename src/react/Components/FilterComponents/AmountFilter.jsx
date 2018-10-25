import React from "react";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { setAmountFilterAmount, setAmountFilterType, clearAmountFilter } from "../../Actions/filters";

class AmountFilter extends React.Component {
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
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        amountFilterAmount: state.amount_filter.amount,
        amountFilterType: state.amount_filter.type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setAmountFilterAmount: amount => dispatch(setAmountFilterAmount(amount)),
        setAmountFilterType: amount => dispatch(setAmountFilterType(amount)),
        clearAmountFilter: () => dispatch(clearAmountFilter())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AmountFilter);

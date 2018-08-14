import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import ClearIcon from "@material-ui/icons/Clear";

import { setAmountFilter, clearAmountFilter } from "../../Actions/filters";

class AmountFilter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    handleChange = event => {
        this.props.setAmountFilter(event.target.value);
    };

    render() {
        const t = this.props.t;
        return [
            <TextField
                label={t("Filter by amount")}
                style={this.props.style}
                value={this.props.amountFilter}
                onChange={this.handleChange}
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={this.props.clearSearchFilter}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />,
            <TextField
                label={t("Filter by amount")}
                style={this.props.style}
                value={this.props.amountFilter}
                onChange={this.handleChange}
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={this.props.clearAmountFilter}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        ];
    }
}

AmountFilter.defaultProps = {
    style: {}
};

const mapStateToProps = state => {
    return {
        amountFilter: state.amount_filter.amount,
        amountFilterType: state.amount_filter.type,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setAmountFilter: amount => dispatch(setAmountFilter(amount)),
        clearAmountFilter: () => dispatch(clearAmountFilter())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmountFilter);

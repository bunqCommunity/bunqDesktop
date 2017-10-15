import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import ArrowUpwardIcon from "material-ui-icons/ArrowUpward";
import ArrowDownwardIcon from "material-ui-icons/ArrowDownward";
import FilterListIcon from "material-ui-icons/FilterList";

import { rotatePaymentFilterType } from "../../Actions/payment_filter";

class PaymentType extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        let filterColor = "default";
        let filterIcon = <FilterListIcon />;
        switch (this.props.paymentType) {
            case "received":
                filterColor = "primary";
                filterIcon = <ArrowUpwardIcon />;
                break;
            case "sent":
                filterIcon = <ArrowDownwardIcon />;
                filterColor = "accent";
                break;
        }

        return (
            <IconButton
                onClick={this.props.rotatePaymentFilterType}
                color={filterColor}
            >
                {filterIcon}
            </IconButton>
        );
    }
}

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        rotatePaymentFilterType: () => dispatch(rotatePaymentFilterType())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentType);

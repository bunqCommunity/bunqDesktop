import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";

import { clearPaymentFilterType } from "../../Actions/payment_filter";
import { clearRequestFilterType } from "../../Actions/request_filter";
import { clearBunqMeTabFilterType } from "../../Actions/bunq_me_tab_filter";

class ClearFilter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    clearAll = () => {
        this.props.clearPaymentFilterType();
        this.props.clearBunqMeTabFilterType();
        this.props.clearRequestFilterType();
    };

    render() {
        if (
            this.props.paymentType === "default" &&
            this.props.bunqMeTabType === "default" &&
            this.props.requestType === "default" &&
            this.props.paymentVisibility === true &&
            this.props.bunqMeTabVisibility === true &&
            this.props.requestVisibility === true
        ) {
            return null;
        }
        return (
            <IconButton onClick={this.clearAll}>
                <ClearIcon />
            </IconButton>
        );
    }
}

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,

        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,

        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearRequestFilterType: () => dispatch(clearRequestFilterType()),
        clearBunqMeTabFilterType: () => dispatch(clearBunqMeTabFilterType()),
        clearPaymentFilterType: () => dispatch(clearPaymentFilterType())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearFilter);

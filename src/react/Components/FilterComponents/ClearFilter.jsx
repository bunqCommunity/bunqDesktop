import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";

import { resetFilters } from "../../Actions/general_filter";

class ClearFilter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        if (
            this.props.paymentType === "default" &&
            this.props.bunqMeTabType === "active" &&
            this.props.requestType === "default" &&
            this.props.paymentVisibility === true &&
            this.props.bunqMeTabVisibility === true &&
            this.props.requestVisibility === true
        ) {
            return null;
        }
        return (
            <IconButton onClick={this.props.resetFilters}>
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
        resetFilters: () => dispatch(resetFilters())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearFilter);

import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

import { resetFilters } from "../../Actions/filters";

class ClearFilter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        if (
            this.props.selectedCategories.length <= 0 &&
            this.props.searchTerm.length <= 0 &&
            this.props.paymentType === "default" &&
            this.props.bunqMeTabType === "active" &&
            this.props.requestType === "default" &&
            this.props.paymentVisibility === true &&
            this.props.bunqMeTabVisibility === true &&
            this.props.requestVisibility === true
        ) {
            return null;
        }

        return this.props.bigButton ? (
            <Button
                variant="raised"
                key={"button"}
                onClick={this.props.resetFilters}
                {...this.props.buttonProps}
            >
                Clear <ClearIcon />
            </Button>
        ) : (
            <IconButton
                key={"iconbutton"}
                onClick={this.props.resetFilters}
                {...this.props.buttonProps}
            >
                <ClearIcon />
            </IconButton>
        );
    }
}

ClearFilter.defaultProps = {
    bigButton: false,
    buttonProps: {}
};

const mapStateToProps = state => {
    return {
        searchTerm: state.search_filter.search_term,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,

        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,

        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

        selectedCategories: state.category_filter.selected_categories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetFilters: () => dispatch(resetFilters())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearFilter);

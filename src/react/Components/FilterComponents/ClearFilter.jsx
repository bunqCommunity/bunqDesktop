import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

import FilterDisabledChecker from "../../Helpers/FilterDisabledChecker";

import { resetFilters } from "../../Actions/filters";

class ClearFilter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            selectedAccountIds,
            selectedCategories,
            searchTerm,
            paymentType,
            bunqMeTabType,
            requestType,
            paymentVisibility,
            bunqMeTabVisibility,
            requestVisibility,
            amountFilterAmount
        } = this.props;

        if (
            FilterDisabledChecker({
                selectedAccountIds,
                selectedCategories,
                searchTerm,
                paymentType,
                bunqMeTabType,
                requestType,
                paymentVisibility,
                bunqMeTabVisibility,
                requestVisibility,
                amountFilterAmount
            })
        ) {
            return null;
        }

        return this.props.bigButton ? (
            <Button variant="contained" key={"button"} onClick={this.props.resetFilters} {...this.props.buttonProps}>
                Clear <ClearIcon />
            </Button>
        ) : (
            <IconButton key={"iconbutton"} onClick={this.props.resetFilters} {...this.props.buttonProps}>
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

        selectedCategories: state.category_filter.selected_categories,
        selectedAccountIds: state.account_id_filter.selected_account_ids,

        amountFilterAmount: state.amount_filter.amount
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetFilters: () => dispatch(resetFilters())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClearFilter);

import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

import FilterDisabledChecker from "../../Functions/FilterDisabledChecker";

import { resetFilters } from "../../Actions/filters";

class ClearFilter extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            dateFromFilter,
            dateToFilter,
            selectedCategories,
            selectedAccountIds,
            selectedCardIds,
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
                dateFromFilter,
                dateToFilter,
                selectedCategories,
                selectedAccountIds,
                selectedCardIds,
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
            <Button variant="outlined" key={"button"} onClick={this.props.resetFilters} {...this.props.buttonProps}>
                {t("Clear")} <ClearIcon />
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
        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,

        selectedCategories: state.category_filter.selected_categories,
        toggleCategoryIds: state.category_filter.toggle,
        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle,
        selectedCardIds: state.card_id_filter.selected_card_ids,
        toggleCardIds: state.card_id_filter.toggle,

        amountFilterAmount: state.amount_filter.amount
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetFilters: () => dispatch(resetFilters())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearFilter);

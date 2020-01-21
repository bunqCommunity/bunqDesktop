import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import { AppWindow } from "~app";

import FilterDisabledChecker from "~functions/FilterDisabledChecker";

import { resetFilters } from "~actions/filters";
import { AppDispatch, ReduxState } from "~store/index";

interface IState {
}

interface IProps {
    t: AppWindow["t"];
}

class ClearFilter extends React.PureComponent<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        bigButton: false,
        buttonProps: {}
    };

    state: IState;

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
            amountFilterAmount,
            t,
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

const mapStateToProps = (state: ReduxState) => {
    return {
        searchTerm: state.search_filter.search_term,
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunqMeTabFilter.type,
        bunqMeTabVisibility: state.bunqMeTabFilter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,
        dateFromFilter: state.dateFilter.from_date,
        dateToFilter: state.dateFilter.to_date,

        selectedCategories: state.categoryFilter.selected_categories,
        toggleCategoryIds: state.categoryFilter.toggle,
        selectedAccountIds: state.accountIdFilter.selectedAccountIds,
        toggleAccountIds: state.accountIdFilter.toggle,
        selectedCardIds: state.cardIdFilter.selected_card_ids,
        toggleCardIds: state.cardIdFilter.toggle,

        amountFilterAmount: state.amountFilter.amount
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        resetFilters: () => dispatch(resetFilters())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearFilter);

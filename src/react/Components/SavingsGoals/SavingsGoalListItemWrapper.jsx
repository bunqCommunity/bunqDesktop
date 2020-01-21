import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SavingsGoalListItem from "./SavingsGoalListItem";
import SavingsGoalSmallListItem from "./SavingsGoalSmallListItem";

import SavingsGoal from "../../Models/SavingsGoal";

const SavingsGoalListItemWrapper = props => {
    const {
        t,
        type,
        accounts,
        shareInviteMonetaryAccountResponses,
        clickDisabled = false,
        savingsGoal,
        ...restProps
    } = props;

    switch (type) {
        case "regular":
            return (
                <SavingsGoalListItem
                    t={t}
                    clickDisabled={clickDisabled}
                    savingsGoal={savingsGoal}
                    accounts={accounts}
                    shareInviteMonetaryAccountResponses={shareInviteMonetaryAccountResponses}
                    {...restProps}
                />
            );
        case "small":
            return (
                <SavingsGoalSmallListItem
                    t={t}
                    clickDisabled={clickDisabled}
                    savingsGoal={savingsGoal}
                    accounts={accounts}
                    shareInviteMonetaryAccountResponses={shareInviteMonetaryAccountResponses}
                    {...restProps}
                />
            );
    }
    return null;
};

SavingsGoalListItemWrapper.defaultProps = {
    type: "regular"
};

SavingsGoalListItemWrapper.propTypes = {
    t: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    savingsGoal: PropTypes.instanceOf(SavingsGoal)
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses
    };
};

export default connect(mapStateToProps)(SavingsGoalListItemWrapper);

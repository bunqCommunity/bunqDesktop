import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SavingsGoalListItem from "./SavingsGoalListItem";
import SavingsGoalSmallListItem from "./SavingsGoalSmallListItem";

import SavingsGoal from "../../Models/SavingsGoal";

const SavingsGoalListItemWrapper = props => {
    const { t, type, accounts, clickDisabled = false, savingsGoal } = props;

    switch (type) {
        case "regular":
            return (
                <SavingsGoalListItem
                    t={t}
                    clickDisabled={clickDisabled}
                    savingsGoal={savingsGoal}
                    accounts={accounts}
                />
            );
        case "small":
            return (
                <SavingsGoalSmallListItem
                    t={t}
                    clickDisabled={clickDisabled}
                    savingsGoal={savingsGoal}
                    accounts={accounts}
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
        accounts: state.accounts.accounts
    };
};

export default connect(mapStateToProps)(SavingsGoalListItemWrapper);

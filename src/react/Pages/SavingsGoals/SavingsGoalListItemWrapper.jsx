import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SavingsGoalListItem from "./SavingsGoalListItem";
import SavingsGoalSmallListItem from "./SavingsGoalSmallListItem";

import SavingsGoal from "../../Models/SavingsGoal";

const SavingsGoalListItemWrapper = props => {
    const { t, type, accounts, savingsGoal } = props;

    const totalSaved = accounts.reduce((accumulator, account) => {
        if (savingsGoal.accountIds.includes(account.id)) {
            return accumulator + account.getBalance();
        }
        return accumulator;
    }, 0);

    const startValue = savingsGoal.getSetting("startAmount") || 0;
    const currentlySaved = totalSaved > startValue ? totalSaved - startValue : 0;
    const endValue = savingsGoal.goalAmount;
    const normalise = value => {
        if (value > endValue) return 100;
        if (value < startValue) return 0;
        return ((value - startValue) * 100) / (endValue - startValue);
    };
    const percentage = normalise(totalSaved);

    switch (type) {
        case "regular":
            return (
                <SavingsGoalListItem
                    t={t}
                    savingsGoal={savingsGoal}
                    totalSaved={totalSaved}
                    startValue={startValue}
                    currentlySaved={currentlySaved}
                    endValue={endValue}
                    percentage={percentage}
                />
            );
        case "small":
            return <SavingsGoalSmallListItem t={t} savingsGoal={savingsGoal} percentage={percentage} />;
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

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SavingsGoalListItem from "./SavingsGoalListItem";
import SavingsGoalSmallListItem from "./SavingsGoalSmallListItem";

import SavingsGoal from "../../Models/SavingsGoal";

const SavingsGoalListItemWrapper = props => {
    const { t, type, accounts, shareInviteBankResponses, clickDisabled = false, savingsGoal, ...restProps } = props;

    switch (type) {
        case "regular":
            return (
                <SavingsGoalListItem
                    t={t}
                    clickDisabled={clickDisabled}
                    savingsGoal={savingsGoal}
                    accounts={accounts}
                    shareInviteBankResponses={shareInviteBankResponses}
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
                    shareInviteBankResponses={shareInviteBankResponses}
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

        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses
    };
};

export default connect(mapStateToProps)(SavingsGoalListItemWrapper);

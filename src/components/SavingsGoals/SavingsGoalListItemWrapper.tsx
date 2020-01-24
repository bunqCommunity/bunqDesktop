import React from "react";
import { connect } from "react-redux";
import { ReduxState } from "~store/index";

import SavingsGoalListItem from "./SavingsGoalListItem";
import SavingsGoalSmallListItem from "./SavingsGoalSmallListItem";

import SavingsGoal from "~models/SavingsGoal";

interface IProps {
    [key: string]: any;
}

const SavingsGoalListItemWrapper = (props: ReturnType<typeof mapStateToProps> & IProps) => {
    const {
        t,
        type,
        accounts,
        shareInviteMonetaryAccountResponses,
        clickDisabled = false,
        savingsGoal,
        ...restProps
    } = props;

    switch (type ?? "regular") {
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

const mapStateToProps = (state: ReduxState) => {
    return {
        accounts: state.accounts.accounts,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses
    };
};

export default connect(mapStateToProps)(SavingsGoalListItemWrapper);

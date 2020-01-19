import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";

import SavingsGoalListItemWrapper from "./SavingsGoalListItemWrapper";

const styles = {
    list: {
        width: "100%"
    },
    gridContainer: {
        width: "100%"
    }
};

const SavingsGoalList = props => {
    const { t, savingsGoals, type, hiddenTypes } = props;

    const savingsGoalsList = Object.keys(savingsGoals)
        .filter(savingsGoalId => {
            const savingsGoal = savingsGoals[savingsGoalId];

            if (hiddenTypes && hiddenTypes.length > 0) {
                if (hiddenTypes.includes("ended") && savingsGoal.isEnded === true) {
                    return false;
                }
                if (hiddenTypes.includes("expired") && savingsGoal.isExpired === true) {
                    return false;
                }
            }
            return true;
        })
        .sort((savingsGoalIdA, savingsGoalIdB) => {
            const savingsGoalA = savingsGoals[savingsGoalIdA];
            const savingsGoalB = savingsGoals[savingsGoalIdB];

            if (!savingsGoalA.isEnded && savingsGoalB.isEnded) {
                return -1;
            } else if (savingsGoalA.isEnded && !savingsGoalB.isEnded) {
                return 1;
            }
            return (
                savingsGoalA.getStatistic("percentage", props.accounts, props.shareInviteMonetaryAccountResponses) <
                savingsGoalB.getStatistic("percentage", props.accounts, props.shareInviteMonetaryAccountResponses)
            );
        })
        .map(savingsGoalId => (
            <SavingsGoalListItemWrapper
                key={savingsGoalId}
                t={t}
                type={type}
                savingsGoal={savingsGoals[savingsGoalId]}
            />
        ));

    switch (type) {
        case "regular":
            return (
                <Grid container spacing={8} style={styles.gridContainer}>
                    {savingsGoalsList}
                </Grid>
            );
        case "small":
            return <List style={styles.list}>{savingsGoalsList}</List>;
    }
    return null;
};

SavingsGoalList.defaultProps = {
    type: "regular",
    hiddenTypes: []
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

        savingsGoalsLastUpdate: state.savings_goals.last_update,
        savingsGoals: state.savings_goals.savings_goals
    };
};

export default connect(mapStateToProps)(translate("translations")(SavingsGoalList));

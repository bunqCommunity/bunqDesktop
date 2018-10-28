/**
 * @param {SavingsGoal[]} savings_goals
 */
export const setSavingsGoals = savings_goals => {
    return {
        type: "SAVINGS_GOALS_SET_SAVINGS_GOALS",
        payload: {
            savings_goals
        }
    };
};

/**
 * @param {SavingsGoal} savings_goal
 */
export const setSavingsGoal = savings_goal => {
    return {
        type: "SAVINGS_GOALS_SET_SAVINGS_GOAL",
        payload: {
            savings_goal
        }
    };
};

export const removeSavingsGoal = savings_goal_id => {
    return {
        type: "SAVINGS_GOALS_REMOVE_SAVINGS_GOAL",
        payload: {
            savings_goal_id
        }
    };
};

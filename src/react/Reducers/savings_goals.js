import settings from "../ImportWrappers/electronSettings";
import { generateGUID } from "../Functions/Utils";
import SavingsGoal from "../Models/SavingsGoal";

export const BUNQDESKTOP_SAVINGS_GOALS = "BUNQDESKTOP_SAVINGS_GOALS";

// default values if no data is stored
const savingsGoalsStored = settings.get(BUNQDESKTOP_SAVINGS_GOALS);
const savingsGoalsStoredDefault =
    savingsGoalsStored !== undefined ? JSON.parse(JSON.stringify(savingsGoalsStored)) : {};

// map stored values to objects
const mappedSavingsGoals = {};
Object.keys(savingsGoalsStoredDefault).map(savingsGoal => {
    const savingsGoalObject = new SavingsGoal(savingsGoalsStoredDefault[savingsGoal]);
    mappedSavingsGoals[savingsGoalObject.id] = savingsGoalObject;
});

// store the default savings goals if doesn't exist
if (savingsGoalsStored === undefined) settings.set(BUNQDESKTOP_SAVINGS_GOALS, {});

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    savings_goals: mappedSavingsGoals
};

const storeSavingsGoalsSafe = savingsGoals => {
    const jsonSafeSavingsGoals = {};
    Object.keys(savingsGoals).forEach(savingsGoalId => {
        const savingsGoal = savingsGoals[savingsGoalId];
        jsonSafeSavingsGoals[savingsGoalId] = savingsGoal.toJSON();
    });
    settings.set(BUNQDESKTOP_SAVINGS_GOALS, jsonSafeSavingsGoals);
};

export default function reducer(state = defaultState, action) {
    const savingsGoals = { ...state.savings_goals };

    switch (action.type) {
        case "SAVINGS_GOALS_UPDATE_STATISTICS":
            Object.keys(savingsGoals).forEach(savingsGoalId => {
                const savingsGoal = savingsGoals[savingsGoalId];

                // ignore savings goals already ended or expired
                if (savingsGoal.isEnded || savingsGoal.isExpired) return;

                // force update the statistics
                savingsGoal.getStatistics(action.payload.accounts, action.payload.shareInviteMonetaryAccountResponses);

                const savingsGoalPercentage = savingsGoal.getStatistic("percentage");
                if (savingsGoalPercentage >= 100) {
                    savingsGoal.setEnded(true);
                }
            });

            storeSavingsGoalsSafe(savingsGoals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: savingsGoals
            };

        case "SAVINGS_GOALS_SET_SAVINGS_GOALS":
            storeSavingsGoalsSafe(action.payload.savings_goals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: action.payload.savings_goals
            };

        case "SAVINGS_GOALS_SET_SAVINGS_GOAL":
            const savingsGoal = action.payload.savings_goal;
            savingsGoals[savingsGoal.id] = savingsGoal;

            storeSavingsGoalsSafe(savingsGoals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: savingsGoals
            };

        case "SAVINGS_GOALS_REMOVE_SAVINGS_GOAL":
            const currentSavingsGoals = { ...state.savings_goals };
            const removeSavingsGoalId = action.payload.savings_goal_id;

            // delete this savings goal from the list
            if (currentSavingsGoals[removeSavingsGoalId]) {
                delete currentSavingsGoals[removeSavingsGoalId];
            }

            storeSavingsGoalsSafe(currentSavingsGoals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: currentSavingsGoals
            };

        // update savings_goals in new settings location
        case "OPTIONS_OVERWRITE_SETTINGS_LOCATION":
            storeSavingsGoalsSafe(state.savings_goals);
            return { ...state };

        // load savings_goals from new settings location
        case "OPTIONS_LOAD_SETTINGS_LOCATION":
            const storedSavingsGoals = settings.get(BUNQDESKTOP_SAVINGS_GOALS);
            const parsedStoredList = {};
            if (storedSavingsGoals) {
                Object.keys(storedSavingsGoals).forEach(id => {
                    parsedStoredList[id] = new SavingsGoal(storedSavingsGoals[id]);
                });
            }

            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: {
                    ...state.savings_goals,
                    ...storedSavingsGoals
                }
            };
    }
    return state;
}

import settings from "../ImportWrappers/electronSettings";
import { generateGUID } from "../Helpers/Utils";
import SavingsGoal from "../Models/SavingsGoal";

export const BUNQDESKTOP_SAVINGS_GOALS = "BUNQDESKTOP_SAVINGS_GOALS";

// default values if no data is stored
const savingsGoalsStored = settings.get(BUNQDESKTOP_SAVINGS_GOALS);
const savingsGoalsStoredDefault =
    savingsGoalsStored !== undefined ? JSON.parse(JSON.stringify(savingsGoalsStored)) : {};

// map stored values to objects
const mappedSavingsGoals = {};
Object.keys(savingsGoalsStoredDefault).map(savingsGoal => {
    const savingsGoalObject = new SavingsGoal(savingsGoal);
    mappedSavingsGoals[savingsGoalObject.id] = savingsGoalObject;
});

// store the default savings goals if doesn't exist
if (savingsGoalsStored === undefined) settings.set(BUNQDESKTOP_SAVINGS_GOALS, {});

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    savings_goals: mappedSavingsGoals
};

export default function reducer(state = defaultState, action) {
    const savingsGoals = { ...state.savingsGoals };

    switch (action.type) {
        case "SAVINGS_GOALS_SET_SAVINGS_GOALS":
            settings.set(BUNQDESKTOP_SAVINGS_GOALS, action.payload.savings_goals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: action.payload.savings_goals
            };

        case "SAVINGS_GOALS_SET_SAVINGS_GOAL":
            const randomId = action.payload.id ? action.payload.id : generateGUID();

            // set/overwrite savings goal by the ID
            savingsGoals[randomId] = action.payload.savings_goal;

            // ensure an id is set if this is a new savingsGoal
            savingsGoals[randomId].ensureId();

            settings.set(BUNQDESKTOP_SAVINGS_GOALS, savingsGoals);
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

            settings.set(BUNQDESKTOP_SAVINGS_GOALS, currentSavingsGoals);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: currentSavingsGoals
            };

        // update savings_goals in new settings location
        case "OPTIONS_OVERWRITE_SETTINGS_LOCATION":
            settings.set(BUNQDESKTOP_SAVINGS_GOALS, state.savings_goals);
            return { ...state };

        // load savings_goals from new settings location
        case "OPTIONS_LOAD_SETTINGS_LOCATION":
            const storedSavingsGoals = settings.get(BUNQDESKTOP_SAVINGS_GOALS);
            return {
                ...state,
                last_update: new Date().getTime(),
                savings_goals: storedSavingsGoals ? storedSavingsGoals : state.savings_goals
            };
    }
    return state;
}

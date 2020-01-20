import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

import { STORED_CATEGORY_RULES } from "~misc/consts";
import settings from "~importwrappers/electronSettings";
import { RuleCollectionList } from "~types/Types";
import RuleCollection from "~types/RuleCollection";

// default category rules if no previous were found

// format the basic default category rules
const formattedDefaultCategoryRules = {};
const defaultCategoryRules = require("@bunq-community/bunqdesktop-templates/category-rules.json");
defaultCategoryRules["category-rules"].forEach(defaultCategoryRule => {
    // turn empty json data into ruleCollection objects
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(defaultCategoryRule);
    ruleCollection.ensureId();

    formattedDefaultCategoryRules[ruleCollection.getId()] = ruleCollection;
});

const categoryRulesStored = settings.get(STORED_CATEGORY_RULES);
const categoryRulesDefault: RuleCollectionList =
    categoryRulesStored !== undefined ? categoryRulesStored : formattedDefaultCategoryRules;

// store the default category rules
if (categoryRulesStored === undefined) {
    settings.set(STORED_CATEGORY_RULES, formattedDefaultCategoryRules);
}

// new formatted list
const formattedCategoryRulesDefault: RuleCollectionList = {};
Object.keys(categoryRulesDefault).forEach(categoryRuleId => {
    const ruleCollection: RuleCollection = new RuleCollection();

    // get the json value for this key
    const ruleObject: any = categoryRulesDefault[categoryRuleId];
    // load the stored object string into the rule collection
    ruleCollection.fromObject(ruleObject);
    // add to the list
    formattedCategoryRulesDefault[categoryRuleId] = ruleCollection;
});

const setRuleAction = createAction("setRule");
const setRulesAction = createAction("setRules");
const removeRuleAction = createAction("removeRule");

export interface ICategoryRulesState {
    last_update: number;
    category_rules: RuleCollectionList;
}

const initialState: ICategoryRulesState = {
    last_update: +new Date(),
    category_rules: _.toPlainObject(formattedCategoryRulesDefault),
};

const slice = createSlice({
    name: "categoryRules",
    initialState,
    reducers: {
        [setRuleAction.type](state, action: PayloadAction<RuleCollection>) {
            const rule_collection: RuleCollection = action.payload;
            const categoryRuleId: string = rule_collection.getId();

            // store this collection in the list or overwrite existing
            state.category_rules[categoryRuleId] = rule_collection;

            // store the category rules
            // TODO: move into saga subscribe
            settings.set(STORED_CATEGORY_RULES, state.category_rules);

            state.last_update = +new Date();
        },
        [setRulesAction.type](state, action: PayloadAction<RuleCollectionList>) {
            // TODO: move into saga subscribe
            settings.set(STORED_CATEGORY_RULES, action.payload);

            state.category_rules = action.payload;

            state.last_update = +new Date();
        },
        [removeRuleAction.type](state, action: PayloadAction<string>) {
            const removeCategoryId: string = action.payload;

            // delete this category from the list
            if (state.category_rules[removeCategoryId]) {
                delete state.category_rules[removeCategoryId];
            }

            // store the category rules
            settings.set(STORED_CATEGORY_RULES, state.category_rules);

            state.last_update = +new Date();
        },
        ["OPTIONS_OVERWRITE_SETTINGS_LOCATION"](state) {
            // TODO: move into saga subscribe
            settings.set(STORED_CATEGORY_RULES, state.category_rules);
        },
        ["OPTIONS_LOAD_SETTINGS_LOCATION"](state) {
            // TODO: move into saga subscribe
            const storedCategoryRules = settings.get(STORED_CATEGORY_RULES);
            const parsedStoredList: RuleCollectionList = {};

            if (storedCategoryRules) {
                Object.keys(storedCategoryRules).forEach(id => {
                    parsedStoredList[id] = _.toPlainObject(new RuleCollection(storedCategoryRules[id]));
                });
            }

            state.last_update = +new Date();
            state.category_rules = {
                ...state.category_rules,
                ...parsedStoredList,
            };
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };

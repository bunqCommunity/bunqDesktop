const store = require("store");
import { STORED_CATEGORY_RULES } from "../Actions/category_rules";

import { RuleCollectionList } from "../Types/Types";
import RuleCollection from "../Types/RuleCollection";

const categoryRulesStored = store.get(STORED_CATEGORY_RULES);
const categoryRulesDefault: RuleCollectionList =
    categoryRulesStored !== undefined ? categoryRulesStored : [];

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

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    category_rules: formattedCategoryRulesDefault
};

export default (state = defaultState, action) => {
    const category_rules: RuleCollectionList = { ...state.category_rules };

    switch (action.type) {
        case "CATEGORY_RULE_SET_CATEGORY_RULES":
            const category_rules_new: RuleCollectionList =
                action.payload.category_rules;

            // store the category rules
            store.set(STORED_CATEGORY_RULES, category_rules_new);

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: action.payload.category_rules
            };

        case "CATEGORY_RULE_SET_CATEGORY_RULE":
            const rule_collection: RuleCollection =
                action.payload.rule_collection;
            const categoryRuleId: string = rule_collection.getId();

            // store this collection in the list or overwrite existing
            category_rules[categoryRuleId] = rule_collection;

            // store the category rules
            store.set(STORED_CATEGORY_RULES, category_rules);

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };

        case "CATEGORY_RULE_REMOVE_CATEGORY_RULE":
            const removeCategoryId = action.payload.category_rule_id;

            // delete this category from the list
            if (category_rules[removeCategoryId]) {
                delete category_rules[removeCategoryId];
            }

            // store the category rules
            store.set(STORED_CATEGORY_RULES, category_rules);

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };
    }
    return state;
};

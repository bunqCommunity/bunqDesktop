import { STORED_CATEGORY_RULES } from "../Actions/category_rules";

import { RuleCollectionList } from "../Types/Types";
import RuleCollection from "../Types/RuleCollection";

// construct the default state
const categoryRulesDefault: RuleCollectionList = {};
export const defaultState = {
    last_update: new Date().getTime(),
    category_rules: categoryRulesDefault
};

export default (state = defaultState, action) => {
    const category_rules: RuleCollectionList = { ...state.category_rules };

    switch (action.type) {
        case "CATEGORY_RULE_SET_CATEGORY_RULES":
            const category_rules_new: RuleCollectionList =
                action.payload.category_rules;

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: category_rules_new
                        },
                        STORED_CATEGORY_RULES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

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

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: category_rules
                        },
                        STORED_CATEGORY_RULES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

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

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: category_rules
                        },
                        STORED_CATEGORY_RULES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };
    }
    return state;
};

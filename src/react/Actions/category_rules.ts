import RuleCollection from "../Types/RuleCollection";

import { RuleCollectionList } from "../Types/Types";

export const STORED_CATEGORY_RULES = "BUNQDESKTOP_STORED_CATEGORY_RULES";

export const setCategoryRule = (rule_collection: RuleCollection) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULE",
        payload: {
            rule_collection: rule_collection
        }
    };
};

export const setCategoryRules = (categoryRules: RuleCollectionList) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULES",
        payload: {
            category_rules: categoryRules
        }
    };
};

export const removeCategoryRule = (categoryRuleId: string) => {
    return {
        type: "CATEGORY_RULE_REMOVE_CATEGORY_RULE",
        payload: {
            category_rule_id: categoryRuleId
        }
    };
};

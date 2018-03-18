import RuleCollection from "../Types/RuleCollection";

import { RuleCollectionList } from "../Types/Types";

export const STORED_CATEGORY_RULES = "BUNQDESKTOP_STORED_CATEGORY_RULES";

export const setCategoryRule = (
    BunqJSClient,
    rule_collection: RuleCollection
) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULE",
        payload: {
            BunqJSClient,
            rule_collection: rule_collection
        }
    };
};

export const setCategoryRules = (
    BunqJSClient,
    categoryRules: RuleCollectionList
) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULES",
        payload: {
            BunqJSClient,
            category_rules: categoryRules
        }
    };
};

export const removeCategoryRule = (BunqJSClient, categoryRuleId: string) => {
    return {
        type: "CATEGORY_RULE_REMOVE_CATEGORY_RULE",
        payload: {
            BunqJSClient,
            category_rule_id: categoryRuleId
        }
    };
};

export function loadCategoryRules(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_CATEGORY_RULES)
            .then(data => {
                if (data && data.items) {
                    const formattedList: RuleCollectionList = {};

                    Object.keys(data.items).forEach(categoryRuleId => {
                        const ruleCollection: RuleCollection = new RuleCollection();

                        // get the json value for this key
                        const ruleObject: string = data.items[categoryRuleId];

                        // load the stored object string into the object
                        ruleCollection.fromObject(ruleObject);

                        // add to the list
                        formattedList[categoryRuleId] = ruleCollection;
                    });

                    dispatch(setCategoryRules(BunqJSClient, formattedList));
                }
            })
            .catch(error => {});
    };
}

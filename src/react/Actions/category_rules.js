export const STORED_CATEGORY_RULES = "BUNQDESKTOP_STORED_CATEGORY_RULES";

export const setCategoryRule = (BunqJSClient, categoryRuleId = false) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULE",
        payload: {
            category_rule_id: categoryRuleId
        }
    };
};

export const setCategoryRules = (BunqJSClient, categoryRules) => {
    return {
        type: "CATEGORY_RULE_SET_CATEGORY_RULES",
        payload: {
            category_rules: categoryRules
        }
    };
};

export const removeCategoryRule = (BunqJSClient, categoryRuleId) => {
    return {
        type: "CATEGORY_RULE_REMOVE_CATEGORY_RULE",
        payload: {
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
                    dispatch(setCategoryRules(BunqJSClient, data.items));
                }
            })
            .catch(error => {});
    };
}

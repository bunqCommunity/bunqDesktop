import settings from "../ImportWrappers/electronSettings";

// storage location
import { STORED_CATEGORY_RULES } from "../Actions/category_rules";

// type checkign imports
import { RuleCollectionList } from "../Types/Types";
import RuleCollection from "../Types/RuleCollection";

// default category rules if no previous were found
const defaultCategoryRules: any[] = require("@bunq-community/bunqdesktop-templates/category-rules.json");

// format the basic default category rules
const formattedDefaultCategoryRules = {};
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

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    category_rules: formattedCategoryRulesDefault
};

export default (state = defaultState, action) => {
    const category_rules: RuleCollectionList = { ...state.category_rules };

    switch (action.type) {
        case "CATEGORY_RULE_SET_CATEGORY_RULES":
            const category_rules_new: RuleCollectionList = action.payload.category_rules;

            // store the category rules
            settings.set(STORED_CATEGORY_RULES, category_rules_new);

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: action.payload.category_rules
            };

        case "CATEGORY_RULE_SET_CATEGORY_RULE":
            const rule_collection: RuleCollection = action.payload.rule_collection;
            const categoryRuleId: string = rule_collection.getId();

            // store this collection in the list or overwrite existing
            category_rules[categoryRuleId] = rule_collection;

            // store the category rules
            settings.set(STORED_CATEGORY_RULES, category_rules);

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
            settings.set(STORED_CATEGORY_RULES, category_rules);

            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };

        // update categories in new settings location
        case "OPTIONS_OVERWRITE_SETTINGS_LOCATION":
            settings.set(STORED_CATEGORY_RULES, state.category_rules);
            return { ...state };

        // load categories from new settings location
        case "OPTIONS_LOAD_SETTINGS_LOCATION":
            const storedCategoryRules = settings.get(STORED_CATEGORY_RULES);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: storedCategoryRules ? storedCategoryRules : state.category_rules
            };
    }
    return state;
};

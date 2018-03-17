import store from "store";
import { generateGUID } from "../Helpers/Utils";

import {STORED_CATEGORY_RULES} from "../Actions/category_rules"

// construct the default state
export const defaultState = {
    last_update: new Date().getTime(),
    category_rules: {}
};

export default function reducer(state = defaultState, action) {
    const category_rules = { ...state.category_rules };

    switch (action.type) {
        case "CATEGORY_RULE_SET_CATEGORY_RULES":
            store.set(STORED_CATEGORY_RULES, action.payload.category_rules);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: action.payload.category_rules
            };

        case "CATEGORY_RULE_SET_CATEGORY_RULE":
            const randomId = action.payload.id
                ? action.payload.id
                : generateGUID();

            category_rules[randomId] = {
                id: randomId,
                label: action.payload.label,
                color: action.payload.color,
                icon: action.payload.icon,
                priority: action.payload.priority,
                ...action.payload.options
            };

            store.set(STORED_CATEGORY_RULES, category_rules);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };

        case "CATEGORIES_REMOVE_CATEGORY":
            const removeCategoryId = action.payload.category_id;

            // delete this category from the list
            if (category_rules[removeCategoryId]) {
                delete category_rules[removeCategoryId];
            }

            store.set(STORED_CATEGORY_RULES, category_rules);
            return {
                ...state,
                last_update: new Date().getTime(),
                category_rules: category_rules
            };
    }
    return state;
}

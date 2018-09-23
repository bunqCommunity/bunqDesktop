export const defaultState = {
    selected_categories: [],
    toggle: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "CATEGORY_FILTER_ADD_CATEGORY_ID":
            const currentCategories = [...state.selected_categories];

            // prevent duplicates
            if (!currentCategories.includes(action.payload.category_id)) {
                currentCategories.push(action.payload.category_id);
            }

            return {
                ...state,
                selected_categories: currentCategories
            };

        case "CATEGORY_FILTER_REMOVE_CATEGORY_ID":
            const currentCategories2 = [...state.selected_categories];
            currentCategories2.splice(action.payload.index, 1);
            return {
                ...state,
                selected_categories: currentCategories2
            };

        case "CATEGORY_FILTER_TOGGLE_CATEGORY_ID":
            return {
                ...state,
                toggle: !state.toggle
            };

        case "CATEGORY_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}

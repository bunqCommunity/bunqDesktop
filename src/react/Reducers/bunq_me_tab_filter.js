export const defaultState = {
    type: "default",
    visible: true
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        // set a specific filter type
        case "BUNQ_ME_TAB_FILTER_SET_TYPE":
            return {
                ...state,
                type: action.payload.type
            };

        case "BUNQ_ME_TAB_FILTER_TOGGLE_VISIBILITY":
            return {
                ...state,
                visible: !state.visible
            };

        case "BUNQ_ME_TAB_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}

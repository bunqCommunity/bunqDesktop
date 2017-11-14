export const defaultState = {
    type: "default",
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        // set a specific filter type
        case "BUNQ_ME_TAB_FILTER_SET_TYPE":
            return {
                ...state,
                type: action.payload.type
            };

        case "BUNQ_ME_TAB_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}

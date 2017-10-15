export const defaultState = {
    type: "default",
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        // set a specific filter type
        case "PAYMENT_FILTER_SET_TYPE":
            return {
                ...state,
                type: action.payload.type
            };

        // follow the default rotation through the 3 types
        case "PAYMENT_FILTER_ROTATE_TYPE":
            let nextType = "received";
            switch (state.type) {
                case "received":
                    nextType = "sent";
                    break;
                case "sent":
                    nextType = "default";
                    break;
            }
            return {
                ...state,
                type: nextType
            };

        case "PAYMENT_FILTER_CLEAR":
            return {
                ...defaultState
            };
    }
    return state;
}

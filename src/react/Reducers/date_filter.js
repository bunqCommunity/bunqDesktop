export const defaultState = {
    from_date: null,
    to_date: null
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "DATE_FILTER_FROM_SET":
            return {
                ...state,
                from_date: action.payload.date
            };
        case "DATE_FILTER_TO_SET":
            return {
                ...state,
                to_date: action.payload.date
            };

        case "DATE_FILTER_FROM_CLEAR":
            return {
                ...state,
                from_date: null
            };
        case "DATE_FILTER_TO_CLEAR":
            return {
                ...state,
                to_date: null
            };

        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}

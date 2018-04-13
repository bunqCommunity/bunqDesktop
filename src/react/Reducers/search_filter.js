export const defaultState = {
    search_term: ""
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "SEARCH_SET_SEARCH_TERM":
            return {
                ...state,
                search_term: action.payload.search_term.toLowerCase()
            };

        case "CLEAR_SET_SEARCH_TERM":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}

export const defaultState = {
    open: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "SIDEBAR_OPEN":
            return {
                ...state,
                open: true
            };

        case "SIDEBAR_CLOSE":
            return {
                ...state,
                open: false
            };

        case "SIDEBAR_TOGGLE":
            return {
                ...state,
                open: !state.open
            };
    }
    return state;
}

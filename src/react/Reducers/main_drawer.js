export const defaultState = {
    open: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "MAIN_DRAWER_OPEN":
            return {
                ...state,
                open: true
            };

        case "MAIN_DRAWER_CLOSE":
            return {
                ...state,
                open: false
            };
    }
    return state;
}

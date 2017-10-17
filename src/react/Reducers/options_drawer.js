export const defaultState = {
    open: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "DRAWER_OPEN":
            return {
                ...state,
                open: true
            };

        case "DRAWER_CLOSE":
            return {
                ...state,
                open: false
            };
    }
    return state;
}

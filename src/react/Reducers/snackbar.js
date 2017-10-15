export const defaultState = {
    message: "",
    duration: 4000,
    snackbarOpen: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "SNACKBAR_OPEN":
            return {
                ...state,
                snackbarOpen: true,
                message: action.payload.message,
                duration: action.payload.duration
            };

        case "SNACKBAR_CLOSE":
            return {
                ...state,
                ...defaultState
            };
    }
    return state;
}

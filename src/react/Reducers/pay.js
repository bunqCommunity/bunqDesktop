export const defaultState = {
    loading: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "PAY_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "PAY_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
    }
    return state;
}

export const defaultState = {
    loading: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "REQUEST_RESPONSE_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_RESPONSE_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
    }
    return state;
}

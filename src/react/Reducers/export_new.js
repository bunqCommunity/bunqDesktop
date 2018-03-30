export const defaultState = {
    loading: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "EXPORT_NEW_IS_LOADING":
            return {
                loading: true
            };
        case "EXPORT_NEW_IS_NOT_LOADING":
            return {
                loading: false
            };
    }
    return state;
}

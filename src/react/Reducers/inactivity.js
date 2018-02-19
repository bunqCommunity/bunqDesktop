export const defaultState = {
    last_activity: new Date()
};

export default function reducer(state = defaultState, action) {
    return {
        ...state,
        last_activity: new Date()
    };
}

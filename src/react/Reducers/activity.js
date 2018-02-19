export const defaultState = {
    last_activity: new Date()
};

// always update last_inactivity on every action
export default function reducer(state = defaultState, action) {
    console.log(state);
    return {
        ...state,
        last_activity: new Date()
    };
}

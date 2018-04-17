export const defaultState = {
    status_message: "",
    online: true
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "APPLICATION_SET_STATUS_MESSAGE":
            return {
                ...state,
                status_message: action.payload.status_message
            };
        case "APPLICATION_SET_OFFLINE":
            return {
                ...state,
                online: false
            };
        case "APPLICATION_SET_ONLINE":
            return {
                ...state,
                online: true
            };
    }
    return state;
};

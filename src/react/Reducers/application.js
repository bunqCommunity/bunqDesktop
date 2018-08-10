export const defaultState = {
    status_message: "",
    online: true,
    last_auto_update: false
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
        case "APPLICATION_SET_LAST_AUTO_UPDATE":
            return {
                ...state,
                last_auto_update: new Date()
            };
    }
    return state;
};

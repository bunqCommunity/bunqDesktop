export const defaultState = {
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "APPLICATION_SET_STATUS_MESSAGE":
            return {
                ...state,
                status_message: action.payload.status_message
            };
    }
    return state;
};

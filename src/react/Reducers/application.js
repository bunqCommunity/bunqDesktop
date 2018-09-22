export const defaultState = {
    status_message: "",
    online: true,
    force_update: false,
    last_auto_update: false,
    pdf_save_mode_enabled: false
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
        case "APPLICATION_SET_PDF_MODE":
            return {
                ...state,
                pdf_save_mode_enabled: action.payload.enabled
            };

        // can be used to force an update
        case "APPLICATION_FORCE_UPDATE":
            return {
                ...state,
                force_update: new Date()
            };
    }
    return state;
};

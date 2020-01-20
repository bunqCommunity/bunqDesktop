export const defaultState = {
    note_texts: [],
    loading: false,
    event_type: false,
    user_id: false,
    account_id: false,
    event_id: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "NOTE_TEXTS_SET_INFO":
            return {
                ...state,
                note_texts: action.payload.note_texts,
                event_type: action.payload.event_type,
                user_id: action.payload.user_id,
                account_id: action.payload.account_id,
                event_id: action.payload.event_id
            };

        case "NOTE_TEXTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "NOTE_TEXTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "NOTE_TEXTS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return { ...defaultState };
    }
    return state;
};

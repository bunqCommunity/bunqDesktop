import BunqErrorHandler from "~functions/BunqErrorHandler";

export function noteTextsSetInfo(noteTexts, event_type, user_id, account_id, event_id) {
    return {
        type: "NOTE_TEXTS_SET_INFO",
        payload: {
            note_texts: noteTexts,
            event_type: event_type,
            user_id: user_id,
            account_id: account_id,
            event_id: event_id
        }
    };
}

export function notesTextsAddNote(event_type, user_id, account_id, event_id, content) {
    const failedMessage = window.t("We failed to add a new note");

    return dispatch => {
        dispatch(noteTextsLoading());
        window.BunqDesktopClient.BunqJSClient.api.noteText
            .post(event_type, user_id, account_id, event_id, content)
            .then(() => {
                // update the notes
                dispatch(noteTextsUpdate(event_type, user_id, account_id, event_id));
                dispatch(noteTextsNotLoading());
            })
            .catch(error => {
                dispatch(noteTextsNotLoading());
                // disable bunq error handler since this is too inconsistent for now
                // BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function notesTextsUpdateNote(event_type, user_id, account_id, event_id, content, note_id) {
    const failedMessage = window.t("We failed to update the note");

    return dispatch => {
        dispatch(noteTextsLoading());
        window.BunqDesktopClient.BunqJSClient.api.noteText
            .put(event_type, user_id, account_id, event_id, content, note_id)
            .then(() => {
                // update the notes
                dispatch(noteTextsUpdate(event_type, user_id, account_id, event_id));
                dispatch(noteTextsNotLoading());
            })
            .catch(error => {
                dispatch(noteTextsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function notesTextsDeleteNote(event_type, user_id, account_id, event_id, note_id) {
    const failedMessage = window.t("We failed to delete the note");

    return dispatch => {
        dispatch(noteTextsLoading());
        window.BunqDesktopClient.BunqJSClient.api.noteText
            .delete(event_type, user_id, account_id, event_id, note_id)
            .then(() => {
                // update the notes
                dispatch(noteTextsUpdate(event_type, user_id, account_id, event_id));
                dispatch(noteTextsNotLoading());
            })
            .catch(error => {
                dispatch(noteTextsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function noteTextsUpdate(event_type, user_id, account_id, event_id) {
    const failedMessage = window.t("We failed to load your notes");

    return dispatch => {
        dispatch(noteTextsLoading());
        window.BunqDesktopClient.BunqJSClient.api.noteText
            .list(event_type, user_id, account_id, event_id)
            .then(noteTexts => {
                dispatch(noteTextsSetInfo(noteTexts, event_type, user_id, account_id, event_id));
                dispatch(noteTextsNotLoading());
            })
            .catch(error => {
                dispatch(noteTextsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function noteTextsLoading() {
    return { type: "NOTE_TEXTS_IS_LOADING" };
}

export function noteTextsNotLoading() {
    return { type: "NOTE_TEXTS_IS_NOT_LOADING" };
}

export function noteTextsClear() {
    return { type: "NOTE_TEXTS_CLEAR" };
}

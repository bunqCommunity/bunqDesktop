import BunqErrorHandler from "../Functions/BunqErrorHandler";
import Event from "../Models/Event";

export function eventInfoSetInfo(event, event_id) {
    return {
        type: "EVENT_INFO_SET_INFO",
        payload: {
            event: event,
            event_id: event_id
        }
    };
}

export function eventInfoUpdate(BunqJSClient, user_id, event_id) {
    const failedMessage = window.t("We failed to load the event info");

    return dispatch => {
        dispatch(eventInfoLoading());
        BunqJSClient.api.event
            .get(user_id, event_id)
            .then(event => {
                const eventInfo = new Event(event);

                dispatch(eventInfoSetInfo(eventInfo, parseInt(event_id)));
                dispatch(eventInfoNotLoading());
            })
            .catch(error => {
                dispatch(eventInfoNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function eventInfoLoading() {
    return { type: "EVENT_INFO_IS_LOADING" };
}

export function eventInfoNotLoading() {
    return { type: "EVENT_INFO_IS_NOT_LOADING" };
}

export function eventInfoClear() {
    return { type: "EVENT_INFO_CLEAR" };
}

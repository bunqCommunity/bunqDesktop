import store from "store";
import MergeApiObjects from "../Helpers/MergeApiObjects";
import { storeEncryptString } from "../Helpers/CryptoWorkerWrapper";

import { STORED_EVENTS } from "../Actions/events";

export const defaultState = {
    events: [],
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let events = [...state.events];

    switch (action.type) {
        case "EVENTS_UPDATE_INFO":
        case "EVENTS_SET_INFO":
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(false, action.payload.events, ignoreOldItems ? [] : events);

            // limit events to 1000 in total
            const mergedEvents = mergedInfo.items.slice(0, 1000);

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    {
                        items: mergedEvents
                    },
                    STORED_EVENTS,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                events: mergedEvents,
                newer_id: mergedInfo.newer_id,
                older_id: mergedInfo.older_id
            };

        case "EVENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "EVENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "EVENTS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(STORED_EVENTS);
            return {
                ...defaultState
            };
    }
    return state;
};

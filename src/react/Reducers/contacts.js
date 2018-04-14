import { STORED_CONTACTS } from "../Actions/contacts";

export const defaultState = {
    last_update: new Date().getTime(),
    contacts: {},
    loading: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "CONTACTS_SET_INFO_TYPE":
            const contacts = action.payload.contacts;
            const stateContacts = state.contacts;

            // set contacts for this type
            stateContacts[action.payload.type] = contacts;

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: stateContacts
                        },
                        STORED_CONTACTS
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                last_update: new Date().getTime(),
                contacts: stateContacts
            };

        case "CONTACTS_SET_INFO":
            const contacts2 = action.payload.contacts;

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: contacts2
                        },
                        STORED_CONTACTS
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                last_update: new Date().getTime(),
                contacts: contacts2
            };

        case "CONTACTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };
        case "CONTACTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
        case "CONTACTS_CLEAR":
            // remove the data
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .asyncStorageRemove(STORED_CONTACTS)
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...defaultState
            };
    }
    return state;
}

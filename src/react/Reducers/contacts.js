import { STORED_CONTACTS } from "../Actions/contacts";

export const defaultState = {
    last_update: new Date().getTime(),
    contacts: {},
    loading: false
};

const uniqueArray = a => {
    return Array.from(new Set(a));
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "CONTACTS_SET_INFO_TYPE": {
            const currentContactState = { ...state.contacts };
            const contacts = action.payload.contacts;
            const contactType = action.payload.type;

            const currentContacts = currentContactState[contactType] ? currentContactState[contactType] : [];

            // go through all contacts and combine theme
            contacts.map(newContact => {
                let foundExisting = false;
                currentContacts.map(stateContact => {
                    if (newContact.name === stateContact.name) {
                        foundExisting = true;
                        // combine the lists
                        stateContact.emails = uniqueArray([...stateContact.emails, ...newContact.emails]);
                        stateContact.phoneNumbers = uniqueArray([
                            ...stateContact.phoneNumbers,
                            ...newContact.phoneNumbers
                        ]);
                    }
                });

                // no existing found so we just push it to the end instead
                if (foundExisting === false) {
                    currentContacts.push(newContact);
                }
            });

            // sort the contacts
            const sortedCombinedContacts = currentContacts.sort((a, b) => {
                if (a.name === "") {
                    return 1;
                } else if (b.name === "") {
                    return -1;
                }

                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });

            // set the new combined contacts for this type
            currentContactState[action.payload.type] = sortedCombinedContacts;

            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeEncrypt(
                {
                    items: currentContactState
                },
                STORED_CONTACTS
            )
                .then(() => {})
                .catch(() => {});

            return {
                ...state,
                last_update: new Date().getTime(),
                contacts: currentContactState
            };
        }

        case "CONTACTS_SET_INFO": {
            const contacts2 = action.payload.contacts;

            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeEncrypt(
                {
                    items: contacts2
                },
                STORED_CONTACTS
            )
                .then(() => {})
                .catch(() => {});

            return {
                ...state,
                last_update: new Date().getTime(),
                contacts: contacts2
            };
        }
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
            let newState = state;

            if (action.payload.type) {
                // reset this type to empty array
                newState.contacts[action.payload.type] = [];
                newState.last_update = new Date().getTime();

                // store the data if we have access to the bunqjsclient
                if (action.payload.BunqJSClient) {
                    const BunqDesktopClient = window.BunqDesktopClient;
                    BunqDesktopClient.storeEncrypt(
                        {
                            items: newState.contacts
                        },
                        STORED_CONTACTS
                    )
                        .then(() => {})
                        .catch(() => {});
                }
            } else {
                newState = defaultState;

                // remove the data completely
                if (action.payload.BunqJSClient) {
                    action.payload.BunqJSClient.Session.asyncStorageRemove(STORED_CONTACTS)
                        .then(() => {})
                        .catch(() => {});
                }
            }

            return {
                ...state,
                ...newState
            };
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeRemove(STORED_CONTACTS);

            return {
                ...state,
                last_update: new Date().getTime(),
                contacts: {},
                loading: false
            };
    }
    return state;
}

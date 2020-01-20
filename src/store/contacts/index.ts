import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

import BunqDesktopClient from "~components/BunqDesktopClient";
import { STORED_CONTACTS } from "~misc/consts";

declare let window: Window & { BunqDesktopClient: BunqDesktopClient; t: Function };

export interface ISetInfoTypePayload {
    type: string;
    contacts: any;
}

const setInfoTypeAction = createAction("setInfoType");

export interface ISetInfoPayload {
    BunqJSClient?: boolean;
    contacts: any;
}

const setInfoAction = createAction(
    "setInfo",
    ({ BunqJSClient = false, contacts }: ISetInfoPayload) => ({ payload: { BunqJSClient, contacts }})
);
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");

export interface IClearPayload {
    BunqJSClient: boolean;
    type: string;
}

const clearAction = createAction("clear");

export interface IContactsState {
    last_update: number;
    contacts: {
        [key: string]: any;
    };
    loading: boolean;
}

const initialState: IContactsState = {
    last_update: +new Date(),
    contacts: {},
    loading: false
};

const slice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        [setInfoTypeAction.type](state, action: PayloadAction<ISetInfoTypePayload>) {
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
                        stateContact.emails = _.uniq([...stateContact.emails, ...newContact.emails]);
                        stateContact.phoneNumbers = _.uniq([
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

            // set the new combined contacts for this type
            currentContactState[action.payload.type] = currentContacts.sort((a, b) => {
                if (a.name === "") {
                    return 1;
                } else if (b.name === "") {
                    return -1;
                }

                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });

            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeEncrypt(
                {
                    items: currentContactState
                },
                STORED_CONTACTS
            ).then();

            state.last_update = +new Date();
            state.contacts = currentContactState;
        },
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            const contacts2 = action.payload.contacts;

            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeEncrypt(
                {
                    items: contacts2
                },
                STORED_CONTACTS
            )
                .then(() => {
                })
                .catch(() => {
                });

            state.last_update = +new Date();
            state.contacts = contacts2;
        },
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [clearAction.type](state, action: PayloadAction<IClearPayload>) {
            let newState = state;

            if (action.payload.type) {
                // reset this type to empty array
                newState.contacts[action.payload.type] = [];
                newState.last_update = +new Date();

                // store the data if we have access to the bunqjsclient
                if (action.payload.BunqJSClient) {
                    const BunqDesktopClient = window.BunqDesktopClient;
                    BunqDesktopClient.storeEncrypt(
                        {
                            items: newState.contacts
                        },
                        STORED_CONTACTS
                    )
                        .then();
                }
            } else {
                // remove the data completely
                if (action.payload.BunqJSClient) {
                    // FIXME: can't pass BunqJSClient as payload
                    // action.payload.BunqJSClient.Session.asyncStorageRemove(STORED_CONTACTS)
                    //     .then(() => {
                    //     })
                    //     .catch(() => {
                    //     });
                }
            }

            return initialState;
        },
        ["REGISTRATION_CLEAR_PRIVATE_DATA"](state) {
            // TODO: move to saga subscribe
            window.BunqDesktopClient.storeRemove(STORED_CONTACTS);

            state.last_update = +new Date();
            state.contacts = {};
            state.loading = false;
        },
        ["REGISTRATION_LOG_OUT"](state) {
            // TODO: move to saga subscribe
            window.BunqDesktopClient.storeRemove(STORED_CONTACTS);

            state.last_update = +new Date();
            state.contacts = {};
            state.loading = false;
        },
        ["REGISTRATION_CLEAR_USER_INFO"](state) {
            // TODO: move to saga subscribe
            window.BunqDesktopClient.storeRemove(STORED_CONTACTS);

            state.last_update = +new Date();
            state.contacts = {};
            state.loading = false;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };

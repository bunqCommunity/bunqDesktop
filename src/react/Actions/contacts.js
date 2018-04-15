import url from "url";
import axios from "axios";
import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_CONTACTS = "BUNQDESKTOP_STORED_CONTACTS";

export function contactsSetInfoType(contacts, type, BunqJSClient = false) {
    return {
        type: "CONTACTS_SET_INFO_TYPE",
        payload: {
            BunqJSClient,
            type: type,
            contacts: contacts
        }
    };
}

export function contactsSetInfo(contacts, BunqJSClient = false) {
    return {
        type: "CONTACTS_SET_INFO",
        payload: {
            BunqJSClient,
            contacts: contacts
        }
    };
}

export function loadStoredContacts(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_CONTACTS)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects into Model objects
                    dispatch(contactsSetInfo(data.items));
                }
            })
            .catch(error => {});
    };
}

export function contactInfoUpdateGoogle(BunqJSClient, accessToken) {
    const failedMessage = window.t(
        "We failed to load the contacts from your Google account"
    );

    return dispatch => {
        dispatch(contactsLoading());

        // format the url
        const contactsUrl = url.format({
            pathname: "//www.google.com/m8/feeds/contacts/default/full",
            protocol: "https",
            query: {
                alt: "json",
                "max-results": 10000
            }
        });

        axios
            .get(contactsUrl, {
                headers: {
                    "GData-Version": 3.0,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => {
                const responseData = response.data;

                const collectedEntries = [];

                // go through all entries
                responseData.feed.entry.map(entry => {
                    // has email

                    const emails = [];
                    const phoneNumbers = [];
                    let displayName = "";

                    // has emails, loop through them
                    if (entry["gd$email"] && entry["gd$email"].length > 0) {
                        entry["gd$email"].map(email => {
                            emails.push(email.address);
                        });
                    }

                    // has numbers, loop through them
                    if (
                        entry["gd$phoneNumber"] &&
                        entry["gd$phoneNumber"].length > 0
                    ) {
                        entry["gd$phoneNumber"].map(phoneNumber => {
                            const inputNumber = phoneNumber["uri"];

                            // remove the 'uri:' part from string
                            const removedFrontNumber = inputNumber.slice(
                                4,
                                inputNumber.length
                            );

                            // replace - and spaces from string
                            const removedCharsNumber = removedFrontNumber.replace(
                                /[\- ]/g,
                                ""
                            );

                            // add number to the list
                            phoneNumbers.push(removedCharsNumber);
                        });
                    }

                    // has fullname, add it
                    if (entry["gd$name"] && entry["gd$name"]["gd$fullName"]) {
                        displayName = entry["gd$name"]["gd$fullName"]["$t"];
                    }

                    if (emails.length > 0 || phoneNumbers.length > 0) {
                        collectedEntries.push({
                            name: displayName,
                            emails: emails,
                            phoneNumbers: phoneNumbers
                        });
                    }
                });

                const sortedContacts = collectedEntries.sort((a, b) => {
                    if (a.name === "") {
                        return 1;
                    } else if (b.name === "") {
                        return -1;
                    }

                    return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
                });

                // set the contacts
                dispatch(
                    contactsSetInfoType(
                        sortedContacts,
                        "GoogleContacts",
                        BunqJSClient
                    )
                );
                dispatch(contactsNotLoading());
            })
            .catch(error => {
                BunqErrorHandler(dispatch, error, failedMessage);
                dispatch(contactsNotLoading());
            });
    };
}

export function contactsLoading() {
    return { type: "CONTACTS_IS_LOADING" };
}

export function contactsNotLoading() {
    return { type: "CONTACTS_IS_NOT_LOADING" };
}

export function contactsClear(BunqJSClient) {
    return {
        type: "CONTACTS_CLEAR",
        payload: {
            BunqJSClient
        }
    };
}

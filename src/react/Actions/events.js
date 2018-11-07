import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { storeDecryptString } from "../Helpers/CryptoWorkerWrapper";
import Event from "../Models/Event";
import Payment from "../Models/Payment";
import BunqMeTab from "../Models/BunqMeTab";
import RequestInquiryBatch from "../Models/RequestInquiryBatch";
import RequestResponse from "../Models/RequestResponse";
import RequestInquiry from "../Models/RequestInquiry";
import MasterCardAction from "../Models/MasterCardAction";

export const STORED_EVENTS = "BUNQDESKTOP_STORED_EVENTS";

export function eventsSetInfo(events, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "EVENTS_SET_INFO" : "EVENTS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            events
        }
    };
}

export function loadStoredEvents(BunqJSClient) {
    return dispatch => {
        dispatch(eventsLoading());
        storeDecryptString(STORED_EVENTS, BunqJSClient.Session.encryptionKey)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects into Model objects
                    const eventsNew = [];
                    data.items.forEach(item => {
                        const event = new Event(item);
                        switch (event.type) {
                            case "Payment":
                            case "BunqMeTab":
                            case "MasterCardAction":
                            case "RequestInquiry":
                            case "RequestInquiryBatch":
                            case "RequestResponse":
                                eventsNew.push(event);
                                break;
                            case "FeatureAnnouncement":
                            case "ScheduledInstance":
                            case "ScheduledPayment":
                            case "ShareInviteBankInquiry":
                            case "ShareInviteBankResponse":
                            default:
                            // don't do anything special for these
                        }
                    });

                    dispatch(eventsSetInfo(eventsNew));
                }
                dispatch(eventsNotLoading());
            })
            .catch(error => {
                console.log(error);
                dispatch(eventsNotLoading());
            });
    };
}

export function eventInfoUpdate(
    BunqJSClient,
    user_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the events for this account");

    return dispatch => {
        dispatch(eventsLoading());

        BunqJSClient.api.event
            .list(user_id, options)
            .then(events => {
                // turn plain objects into Model objects
                const eventsNew = events.map(item => new Event(item));

                dispatch(eventsSetInfo(eventsNew, false, BunqJSClient));
                dispatch(eventsNotLoading());
            })
            .catch(error => {
                console.log(error);
                dispatch(eventsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function eventsLoading() {
    return { type: "EVENTS_IS_LOADING" };
}

export function eventsNotLoading() {
    return { type: "EVENTS_IS_NOT_LOADING" };
}

export function eventsClear() {
    return { type: "EVENTS_CLEAR" };
}

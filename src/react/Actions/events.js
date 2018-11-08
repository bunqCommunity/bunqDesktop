import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { storeDecryptString } from "../Helpers/CryptoWorkerWrapper";
import { shareInviteBankInquiriesSetInfo } from "./share_invite_bank_inquiries";
import { shareInviteBankResponsesSetInfo } from "./share_invite_bank_responses";
import Event from "../Models/Event";
import Payment from "../Models/Payment";
import BunqMeTab from "../Models/BunqMeTab";
import RequestInquiryBatch from "../Models/RequestInquiryBatch";
import RequestResponse from "../Models/RequestResponse";
import RequestInquiry from "../Models/RequestInquiry";
import MasterCardAction from "../Models/MasterCardAction";

export const STORED_EVENTS = "BUNQDESKTOP_STORED_EVENTS";

export function eventsSetInfo(events, resetOldItems = false, BunqJSClient = false) {
    return dispatch => {
        const type = resetOldItems ? "EVENTS_SET_INFO" : "EVENTS_UPDATE_INFO";

        const eventsNew = [];
        const shareInviteBankInquiries = [];
        events.forEach(event => {
            const eventObject = new Event(event);
            switch (eventObject.type) {
                case "Payment":
                case "BunqMeTab":
                case "MasterCardAction":
                case "RequestInquiry":
                case "RequestInquiryBatch":
                case "RequestResponse":
                case "ScheduledInstance":
                case "ScheduledPayment":
                case "Invoice":
                    eventsNew.push(eventObject);
                    break;
                case "ShareInviteBankInquiry":
                    console.log(eventObject.object);
                    shareInviteBankInquiries.push(eventObject.object);
                    break;
                case "ShareInviteBankResponse":
                case "FeatureAnnouncement":
                default:
                // don't do anything special for these
            }
        });

        if (shareInviteBankInquiries.length > 0) {
            let groupedShareInvites = {};
            shareInviteBankInquiries.forEach(shareInviteBankInquiry => {
                const object = shareInviteBankInquiry.ShareInviteBankInquiry;
                if (!groupedShareInvites[object.monetary_account_id]) {
                    groupedShareInvites[object.monetary_account_id] = [];
                }
                groupedShareInvites[object.monetary_account_id].push(shareInviteBankInquiry);
            });

            Object.keys(groupedShareInvites).forEach(accountId => {
                dispatch(
                    shareInviteBankInquiriesSetInfo(groupedShareInvites[accountId], parseFloat(accountId), BunqJSClient)
                );
            });
        }

        dispatch({
            type: type,
            payload: {
                BunqJSClient: BunqJSClient,
                events: eventsNew
            }
        });
    };
}

export function loadStoredEvents(BunqJSClient) {
    return dispatch => {
        dispatch(eventsLoading());
        storeDecryptString(STORED_EVENTS, BunqJSClient.Session.encryptionKey)
            .then(data => {
                if (data && data.items) {
                    dispatch(eventsSetInfo(data.items));
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
                dispatch(eventsSetInfo(events, false, BunqJSClient));
                dispatch(eventsNotLoading());
            })
            .catch(error => {
                console.error(error);
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

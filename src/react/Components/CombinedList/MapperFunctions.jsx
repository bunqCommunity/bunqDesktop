import React from "react";

import BunqMeTabListItem from "../ListItems/BunqMeTabListItem";
import PaymentListItem from "../ListItems/PaymentListItem";
import MasterCardActionListItem from "../ListItems/MasterCardActionListItem";
import RequestResponseListItem from "../ListItems/RequestResponseListItem";
import RequestInquiryListItem from "../ListItems/RequestInquiryListItem";
import RequestInquiryBatchListItem from "../ListItems/RequestInquiryBatchListItem";
import ShareInviteBankInquiryListItem from "../ListItems/ShareInviteBankInquiryListItem";
import ShareInviteBankResponseListItem from "../ListItems/ShareInviteBankResponseListItem";

import { UTCDateToLocalDate } from "../../Functions/Utils";
import { eventFilter, shareInviteBankInquiryFilter, shareInviteBankResponseFilter } from "../../Functions/DataFilters";

export const eventMapper = (settings, onlyPending = false, onlyNonPending = false) => {
    if (settings.hiddenTypes.includes("Payment")) return [];

    const eventFilterSetup = eventFilter(settings);
    return settings.events
        .filter(eventFilterSetup)
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }

            return true;
        })
        .filter(event => {
            if (event.type !== "RequestResponse") return true;

            if (onlyPending === true) {
                return event.object.RequestResponse.status === "PENDING";
            }

            if (onlyNonPending === true) {
                return event.object.RequestResponse.status !== "PENDING";
            }

            return true;
        })
        .map(event => {
            switch (event.type) {
                case "ScheduledInstance":
                case "ScheduledPayment":
                case "Payment":
                    let paymentObject = event.object;
                    if (event.type === "ScheduledInstance") {
                        paymentObject = event.object.result_object;
                    }
                    if (event.type === "ScheduledPayment") {
                        paymentObject = event.object.payment;
                    }
                    return {
                        component: (
                            <PaymentListItem
                                payment={paymentObject}
                                accounts={settings.accounts}
                                BunqJSClient={settings.BunqJSClient}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(event.created),
                        info: event.object
                    };
                case "MasterCardAction":
                    return {
                        component: (
                            <MasterCardActionListItem
                                masterCardAction={event.object}
                                BunqJSClient={settings.BunqJSClient}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(event.created),
                        info: event.object
                    };
                case "BunqMeTab":
                    return {
                        component: (
                            <BunqMeTabListItem
                                bunqMeTab={event.object}
                                BunqJSClient={settings.BunqJSClient}
                                copiedValue={settings.copiedValue}
                                bunqMeTabLoading={settings.bunqMeTabLoading}
                                bunqMeTabsLoading={settings.bunqMeTabsLoading}
                                bunqMeTabPut={settings.bunqMeTabPut}
                                accounts={settings.accounts}
                                user={settings.user}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(event.object.updated),
                        info: event.object
                    };
                case "RequestInquiry":
                    return {
                        component: (
                            <RequestInquiryListItem
                                requestInquiry={event.object}
                                BunqJSClient={settings.BunqJSClient}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(event.created),
                        info: event.object
                    };
                case "RequestResponse":
                    return {
                        component: (
                            <RequestResponseListItem
                                requestResponse={event.object}
                                BunqJSClient={settings.BunqJSClient}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(
                            event.object.status === "ACCEPTED" ? event.object.time_responded : event.created
                        ),
                        info: event.object
                    };
                case "RequestInquiryBatch":
                    return {
                        component: (
                            <RequestInquiryBatchListItem
                                accounts={settings.accounts}
                                requestInquiryBatch={event.object}
                                BunqJSClient={settings.BunqJSClient}
                            />
                        ),
                        filterDate: UTCDateToLocalDate(event.updated),
                        info: event.object
                    };
                case "Invoice":
                    return {
                        component: <div>Invoice</div>,
                        filterDate: UTCDateToLocalDate(event.updated),
                        info: event.object
                    };
                case "IdealMerchantTransaction":
                    return {
                        component: <div>IdealMerchantTransaction</div>,
                        filterDate: UTCDateToLocalDate(event.updated),
                        info: event.object
                    };
                case "BunqMeFundraiserResult":
                    return {
                        component: <div>BunqMeFundraiserResult</div>,
                        filterDate: UTCDateToLocalDate(event.updated),
                        info: event.object
                    };
            }

            return null;
        });
};

export const shareInviteBankInquiryMapper = settings => {
    if (settings.hiddenTypes.includes("ShareInviteBankInquiry")) return [];

    return settings.shareInviteBankInquiries
        .filter(shareInviteBankInquiryFilter(settings))
        .map(shareInviteBankInquiry => {
            const shareInviteBankInquiryInfo = shareInviteBankInquiry.ShareInviteBankInquiry
                ? shareInviteBankInquiry.ShareInviteBankInquiry
                : shareInviteBankInquiry.ShareInviteBankResponse;

            return {
                component: (
                    <ShareInviteBankInquiryListItem
                        BunqJSClient={settings.BunqJSClient}
                        shareInviteBankInquiry={shareInviteBankInquiryInfo}
                        openSnackbar={settings.openSnackbar}
                        user={settings.user}
                    />
                ),
                filterDate: UTCDateToLocalDate(shareInviteBankInquiryInfo.created),
                info: shareInviteBankInquiry
            };
        });
};

export const shareInviteBankResponseMapper = settings => {
    if (settings.hiddenTypes.includes("ShareInviteBankResponse")) return [];

    return settings.shareInviteBankResponses
        .filter(shareInviteBankResponseFilter(settings))
        .map(shareInviteBankResponse => {
            return (
                <ShareInviteBankResponseListItem
                    BunqJSClient={settings.BunqJSClient}
                    shareInviteBankResponse={shareInviteBankResponse.ShareInviteBankResponse}
                    openSnackbar={settings.openSnackbar}
                    user={settings.user}
                />
            );
        });
};

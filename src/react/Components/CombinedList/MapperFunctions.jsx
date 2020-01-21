import React from "react";

import BunqMeTabListItem from "../ListItems/BunqMeTabListItem";
import PaymentListItem from "../ListItems/PaymentListItem";
import MasterCardActionListItem from "../ListItems/MasterCardActionListItem";
import RequestResponseListItem from "../ListItems/RequestResponseListItem";
import RequestInquiryListItem from "../ListItems/RequestInquiryListItem";
import RequestInquiryBatchListItem from "../ListItems/RequestInquiryBatchListItem";
import ShareInviteMonetaryAccountInquiryListItem from "../ListItems/ShareInviteMonetaryAccountInquiryListItem";
import ShareInviteMonetaryAccountResponseListItem from "../ListItems/ShareInviteMonetaryAccountResponseListItem";

import { UTCDateToLocalDate } from "../../Functions/Utils";
import {
    paymentFilter,
    bunqMeTabsFilter,
    masterCardActionFilter,
    requestInquiryFilter,
    requestInquiryBatchFilter,
    requestResponseFilter,
    shareInviteMonetaryAccountInquiryFilter,
    shareInviteMonetaryAccountResponseFilter
} from "../../Functions/DataFilters";

export const paymentMapper = (settings, hiddenPaymentIds = []) => {
    if (settings.hiddenTypes.includes("Payment")) return [];

    return settings.payments
        .filter(paymentFilter(settings))
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }

            // if hidden ids are set, check if this event is included
            if (hiddenPaymentIds.length > 0) {
                if (hiddenPaymentIds.includes(event.id)) {
                    return false;
                }
            }

            return true;
        })
        .map(payment => {
            return {
                component: (
                    <PaymentListItem
                        payment={payment}
                        accounts={settings.accounts}
                        BunqJSClient={settings.BunqJSClient}
                    />
                ),
                filterDate: UTCDateToLocalDate(payment.created),
                info: payment
            };
        });
};

export const bunqMeTabsMapper = settings => {
    if (settings.hiddenTypes.includes("BunqMeTab")) {
        return {
            hiddenPaymentIds: [],
            bunqMeTabs: []
        };
    }

    let hiddenPaymentIds = [];
    const bunqMeTabs = settings.bunqMeTabs
        .filter(bunqMeTabsFilter(settings))
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }
            return true;
        })
        .map(bunqMeTab => {
            bunqMeTab.result_inquiries.forEach(resultInquiry => {
                const payment = resultInquiry.payment.Payment;
                const paymentId = payment.id;

                // add to the list if not already set
                if (!hiddenPaymentIds.includes(paymentId)) {
                    hiddenPaymentIds.push(paymentId);
                }
            });

            return {
                component: (
                    <BunqMeTabListItem
                        bunqMeTab={bunqMeTab}
                        BunqJSClient={settings.BunqJSClient}
                        copiedValue={settings.copiedValue}
                        bunqMeTabLoading={settings.bunqMeTabLoading}
                        bunqMeTabsLoading={settings.bunqMeTabsLoading}
                        bunqMeTabPut={settings.bunqMeTabPut}
                        accounts={settings.accounts}
                        user={settings.user}
                    />
                ),
                filterDate: UTCDateToLocalDate(bunqMeTab.updated),
                info: bunqMeTab
            };
        });

    return {
        bunqMeTabs,
        hiddenPaymentIds
    };
};

export const masterCardActionMapper = settings => {
    if (settings.hiddenTypes.includes("MasterCardAction")) return [];

    return settings.masterCardActions
        .filter(masterCardActionFilter(settings))
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }
            return true;
        })
        .map(masterCardAction => {
            return {
                component: (
                    <MasterCardActionListItem
                        masterCardAction={masterCardAction}
                        BunqJSClient={settings.BunqJSClient}
                    />
                ),
                filterDate: UTCDateToLocalDate(masterCardAction.created),
                info: masterCardAction
            };
        });
};

export const requestInquiryMapper = (settings, hiddenRequestInquiryIds = []) => {
    if (settings.hiddenTypes.includes("RequestInquiry")) return [];

    return settings.requestInquiries
        .filter(requestInquiryFilter(settings))
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }

            // if hidden ids are set, check if this event is included
            if (hiddenRequestInquiryIds.length > 0 && event.batch_id) {
                if (hiddenRequestInquiryIds.includes(event.batch_id)) {
                    return false;
                }
            }

            return true;
        })
        .map(requestInquiry => {
            return {
                component: (
                    <RequestInquiryListItem requestInquiry={requestInquiry} BunqJSClient={settings.BunqJSClient} />
                ),
                filterDate: UTCDateToLocalDate(requestInquiry.created),
                info: requestInquiry
            };
        });
};

export const requestResponseMapper = (settings, onlyPending = false, onlyNonPending = false) => {
    if (settings.hiddenTypes.includes("RequestResponse")) return [];

    return settings.requestResponses
        .filter(requestResponse => {
            if (onlyPending === true) {
                return requestResponse.RequestResponse.status === "PENDING";
            }

            if (onlyNonPending === true) {
                return requestResponse.RequestResponse.status !== "PENDING";
            }

            return true;
        })
        .filter(requestResponseFilter(settings))
        .filter(event => {
            if (settings.accountId) {
                if (event.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }
            return true;
        })
        .map(requestResponse => {
            return {
                component: (
                    <RequestResponseListItem requestResponse={requestResponse} BunqJSClient={settings.BunqJSClient} />
                ),
                filterDate: UTCDateToLocalDate(
                    requestResponse.status === "ACCEPTED" ? requestResponse.time_responded : requestResponse.created
                ),
                info: requestResponse
            };
        });
};

export const requestInquiryBatchMapper = settings => {
    if (settings.hiddenTypes.includes("RequestInquiryBatch")) {
        return {
            hiddenRequestInquiryIds: [],
            requestInquiryBatches: []
        };
    }

    let hiddenRequestInquiryIds = [];
    const requestInquiryBatches = settings.requestInquiryBatches
        .filter(requestInquiryBatchFilter(settings))
        .filter(requestInquiryBatch => {
            const requestInquiry = requestInquiryBatch.request_inquiries[0];
            if (requestInquiry && settings.accountId) {
                if (requestInquiry.monetary_account_id !== settings.accountId) {
                    return false;
                }
            }

            return true;
        })
        .map(requestInquiryBatch => {
            // hide requests with the following batch id
            hiddenRequestInquiryIds.push(requestInquiryBatch.id);

            return {
                component: (
                    <RequestInquiryBatchListItem
                        accounts={settings.accounts}
                        requestInquiryBatch={requestInquiryBatch}
                        BunqJSClient={settings.BunqJSClient}
                    />
                ),
                filterDate: UTCDateToLocalDate(requestInquiryBatch.updated),
                info: requestInquiryBatch
            };
        });

    return {
        requestInquiryBatches: requestInquiryBatches,
        hiddenRequestInquiryIds: hiddenRequestInquiryIds
    };
};

export const shareInviteMonetaryAccountInquiryMapper = settings => {
    if (settings.hiddenTypes.includes("ShareInviteMonetaryAccountInquiry")) return [];

    return settings.shareInviteBankInquiries
        .filter(shareInviteMonetaryAccountInquiryFilter(settings))
        .map(shareInviteMonetaryAccountInquiry => {
            const shareInviteMonetaryAccountInquiryInfo = shareInviteMonetaryAccountInquiry.ShareInviteMonetaryAccountInquiry
                ? shareInviteMonetaryAccountInquiry.ShareInviteMonetaryAccountInquiry
                : shareInviteMonetaryAccountInquiry.ShareInviteMonetaryAccountResponse;

            return {
                component: (
                    <ShareInviteMonetaryAccountInquiryListItem
                        BunqJSClient={settings.BunqJSClient}
                        shareInviteMonetaryAccountInquiry={shareInviteMonetaryAccountInquiryInfo}
                        openSnackbar={settings.openSnackbar}
                        user={settings.user}
                    />
                ),
                filterDate: UTCDateToLocalDate(shareInviteMonetaryAccountInquiryInfo.created),
                info: shareInviteMonetaryAccountInquiry
            };
        });
};

export const shareInviteMonetaryAccountResponseMapper = settings => {
    if (settings.hiddenTypes.includes("ShareInviteMonetaryAccountResponse")) return [];

    return settings.shareInviteMonetaryAccountResponses
        .filter(shareInviteMonetaryAccountResponseFilter(settings))
        .map(shareInviteMonetaryAccountResponse => {
            return (
                <ShareInviteMonetaryAccountResponseListItem
                    BunqJSClient={settings.BunqJSClient}
                    shareInviteMonetaryAccountResponse={
                        shareInviteMonetaryAccountResponse.ShareInviteMonetaryAccountResponse
                    }
                    openSnackbar={settings.openSnackbar}
                    user={settings.user}
                />
            );
        });
};

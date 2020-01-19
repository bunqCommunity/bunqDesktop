import React from "react";
import { ipcRenderer } from "electron";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Payment from "../../Models/Payment";
import BunqMeTab from "../../Models/BunqMeTab";
import RequestResponse from "../../Models/RequestResponse";
import RequestInquiry from "../../Models/RequestInquiry";
import RequestInquiryBatch from "../../Models/RequestInquiryBatch";
import MasterCardAction from "../../Models/MasterCardAction";

import NotificationHelper from "../../Functions/NotificationHelper";
import { connectGetPermissions } from "../../Functions/ConnectGetPermissions";
import { paymentApiFilter } from "../../Functions/DataFilters";

import {
    queueDecreaseRequestCounter,
    queueIncreaseRequestCounter,
    queueSetRequestCounter,
    queueFinishedSync,
    queueResetSyncState,
    queueStartSync
} from "../../Actions/queue";
import { paymentsSetInfo } from "../../Actions/payments";
import { bunqMeTabsSetInfo } from "../../Actions/bunq_me_tabs";
import { masterCardActionsSetInfo } from "../../Actions/master_card_actions";
import { requestInquiriesSetInfo } from "../../Actions/request_inquiries";
import { requestInquiryBatchesSetInfo } from "../../Actions/request_inquiry_batches";
import { requestResponsesSetInfo } from "../../Actions/request_responses";
import { shareInviteBankInquiriesSetInfo } from "../../Actions/share_invite_monetary_account_inquiries";
import { shareInviteMonetaryAccountResponsesSetInfo } from "../../Actions/share_invite_monetary_account_responses";
import { openSnackbar } from "../../Actions/snackbar";

export const DEFAULT_EVENT_COUNT_LIMIT = 50;
export const EVENT_TOTAL_LIMIT = 1000;

class QueueManager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialSync: false,

            payments: {},
            bunqMeTabs: {},
            requestResponses: {},
            requestInquiries: {},
            requestInquiryBatches: {},
            masterCardActions: {},
            shareInviteBankInquiries: {},
            shareInviteMonetaryAccountResponses: []
        };

        this.delayedQueue = null;
        this.delayedSetState = null;

        this.automaticUpdateTimer = null;
        this.automaticUpdateTimerDuration = null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            accounts,
            accountsLoading,
            user,
            userLoading,
            queueLoading,
            queueRequestCounter,
            syncOnStartup,
            queueTriggerSync
        } = this.props;

        // setup the timer and enable/disable or update it
        this.setupTimer();

        // if sync on startup setting is false, we disable the initial sync event
        if (syncOnStartup === false && this.state.initialSync !== user.id) {
            this.setState({ initialSync: user.id });
        }

        if (queueLoading && queueTriggerSync) {
            this.props.queueResetSyncState();
        }

        // no initial sync completed or manual sync was triggered
        if (this.state.initialSync !== user.id || queueTriggerSync) {
            if (user && !userLoading && accounts && !accountsLoading && accounts.length > 0 && !queueLoading) {
                // if we continue, limit deep search to 5
                const eventCount = queueTriggerSync ? this.props.eventCountLimit : DEFAULT_EVENT_COUNT_LIMIT;

                // clear existing timeout if it exists
                if (this.delayedQueue) clearTimeout(this.delayedQueue);
                // delay the queue update
                this.delayedQueue = setTimeout(() => this.triggerQueueUpdate(eventCount), 100);
            }
        } else {
            if (!queueLoading && prevProps.queueLoading === true && queueRequestCounter === 0) {
                // clear existing timeout if it exists
                if (this.delayedSetState) clearTimeout(this.delayedSetState);
                // delay the queue update
                this.delayedSetState = setTimeout(this.pushQueueData, 100);
            }
        }
    }

    componentWillUnmount() {
        if (this.delayedSetState) clearTimeout(this.delayedSetState);
        if (this.delayedQueue) clearTimeout(this.delayedQueue);
        if (this.automaticUpdateTimer) clearInterval(this.automaticUpdateTimer);
    }

    /**
     * Triggers the actual background sync for all monetary accounts
     * @param continueLoading
     */
    triggerQueueUpdate = (eventCount = 200) => {
        const { queueTriggerSync, accounts, user, limitedPermissions } = this.props;

        if (queueTriggerSync) this.props.queueResetSyncState();

        if (!user || !accounts) {
            return;
        }

        // ensure initial sync is true to avoid endless syncs
        const userId = user.id;
        if (this.state.initialSync !== userId) {
            this.setState({
                initialSync: userId
            });
        }

        // only include active accounts
        const filteredAccounts = accounts.filter(account => {
            return account.status === "ACTIVE";
        });

        // 6 / 7 requests per account + 1 for the user
        let bufferedCounter = 1;

        this.shareInviteMonetaryAccountResponsesUpdate(userId);
        filteredAccounts.forEach(account => {
            const accountId = account.id;

            const connectPermissions = connectGetPermissions(
                this.props.shareInviteMonetaryAccountResponses,
                account.id
            );
            if (connectPermissions === true || connectPermissions.view_new_events) {
                bufferedCounter += 6;
                this.paymentsUpdate(userId, accountId, false, eventCount);
                this.bunqMeTabsUpdate(userId, accountId, false, eventCount);
                this.requestResponsesUpdate(userId, accountId, false, eventCount);
                this.requestInquiriesUpdate(userId, accountId, false, eventCount);
                this.requestInquiryBatchesUpdate(userId, accountId, false, eventCount);
                this.masterCardActionsUpdate(userId, accountId, false, eventCount);
            }

            if (!limitedPermissions) {
                bufferedCounter++;
                this.shareInviteBankInquiriesUpdate(userId, accountId, false, eventCount);
            }
        });

        // set initial request count in one go
        this.props.queueSetRequestCounter(bufferedCounter);
    };

    /**
     * Pushes the data collected in the queue to the actual app state
     */
    pushQueueData = () => {
        const { accounts } = this.props;
        let eventCount = 0;

        const filteredAccounts = accounts.filter(account => {
            return account.status === "ACTIVE";
        });

        let newerPaymentCount = 0;
        let newerBunqMeTabsCount = 0;
        let newerRequestResponsesCount = 0;
        let newerRequestInquiriesCount = 0;
        let newerMasterCardActionsCount = 0;
        let newerShareInviteMonetaryAccountInquiriesCount = 0;
        let newerShareInviteMonetaryAccountResponsesCount = 0;
        filteredAccounts.forEach(account => {
            // get events for this account and fallback to empty list
            const payments = this.state.payments[account.id] || [];
            const bunqMeTabs = this.state.bunqMeTabs[account.id] || [];
            const requestResponses = this.state.requestResponses[account.id] || [];
            const requestInquiries = this.state.requestInquiries[account.id] || [];
            const requestInquiryBatches = this.state.requestInquiryBatches[account.id] || [];
            const masterCardActions = this.state.masterCardActions[account.id] || [];
            const shareInviteBankInquiries = this.state.shareInviteBankInquiries[account.id] || [];
            const shareInviteMonetaryAccountResponses = this.state.shareInviteMonetaryAccountResponses || [];

            // count the new events for each type and account
            const newestPayment = this.props.payments.find(payment => account.id === payment.monetary_account_id);
            if (newestPayment) newerPaymentCount += payments.filter(payment => payment.id > newestPayment.id).length;

            const newestBunqMeTab = this.props.bunqMeTabs.find(
                bunqMeTab => account.id === bunqMeTab.monetary_account_id
            );
            if (newestBunqMeTab)
                newerBunqMeTabsCount += bunqMeTabs.filter(bunqMeTab => bunqMeTab.id > newestBunqMeTab.id).length;

            const newestRequestResponse = this.props.requestResponses.find(
                requestResponse => account.id === requestResponse.monetary_account_id
            );
            if (newestRequestResponse)
                newerRequestResponsesCount += requestResponses.filter(
                    requestResponse => requestResponse.id > newestRequestResponse.id
                ).length;

            const newestRequestInquiry = this.props.requestInquiries.find(
                requestInquiry => account.id === requestInquiry.monetary_account_id
            );
            if (newestRequestInquiry)
                newerRequestInquiriesCount += requestInquiries.filter(
                    requestInquiry => requestInquiry.id > newestRequestInquiry.id
                ).length;

            const newestMasterCardAction = this.props.masterCardActions.find(
                masterCardAction => account.id === masterCardAction.monetary_account_id
            );
            if (newestMasterCardAction)
                newerMasterCardActionsCount += masterCardActions.filter(
                    masterCardAction => masterCardAction.id > newestMasterCardAction.id
                ).length;

            const newestShareInviteMonetaryAccountInquiry = this.props.shareInviteBankInquiries.find(
                shareInviteMonetaryAccountInquiry =>
                    account.id === shareInviteMonetaryAccountInquiry.monetary_account_id
            );
            if (newestShareInviteMonetaryAccountInquiry)
                newerShareInviteMonetaryAccountInquiriesCount += shareInviteBankInquiries.filter(
                    shareInviteMonetaryAccountInquiry =>
                        shareInviteMonetaryAccountInquiry.id > newestShareInviteMonetaryAccountInquiry.id
                ).length;

            const newestShareInviteMonetaryAccountResponse = this.props.shareInviteMonetaryAccountResponses.find(
                shareInviteMonetaryAccountResponse =>
                    account.id === shareInviteMonetaryAccountResponse.monetary_account_id
            );
            if (newestShareInviteMonetaryAccountResponse)
                newerShareInviteMonetaryAccountResponsesCount += shareInviteMonetaryAccountResponses.filter(
                    shareInviteMonetaryAccountResponse =>
                        shareInviteMonetaryAccountResponse.id > newestShareInviteMonetaryAccountResponse.id
                ).length;

            // count the total amount of events
            eventCount += payments.length;
            eventCount += bunqMeTabs.length;
            eventCount += requestResponses.length;
            eventCount += requestInquiries.length;
            eventCount += masterCardActions.length;
            eventCount += shareInviteBankInquiries.length;
            eventCount += shareInviteMonetaryAccountResponses.length;

            // set the info into the application state
            if (payments.length > 0) {
                this.props.paymentsSetInfo(payments, account.id);
            }
            if (bunqMeTabs.length > 0) {
                this.props.bunqMeTabsSetInfo(bunqMeTabs, account.id);
            }
            if (requestResponses.length > 0) {
                this.props.requestResponsesSetInfo(requestResponses, account.id);
            }
            if (requestInquiries.length > 0) {
                this.props.requestInquiriesSetInfo(requestInquiries, account.id);
            }
            if (requestInquiryBatches.length > 0) {
                this.props.requestInquiryBatchesSetInfo(requestInquiryBatches, account.id);
            }
            if (masterCardActions.length > 0) {
                this.props.masterCardActionsSetInfo(masterCardActions, account.id);
            }
            if (shareInviteBankInquiries.length > 0) {
                this.props.shareInviteBankInquiriesSetInfo(shareInviteBankInquiries, account.id);
            }
            if (shareInviteMonetaryAccountResponses.length > 0) {
                this.props.shareInviteMonetaryAccountResponsesSetInfo(shareInviteMonetaryAccountResponses);
            }
        });

        const t = this.props.t;
        const backgroundSyncText = t("Background sync finished");
        const newEventsText = t("new events were found!");
        const andLoadedText = t("and loaded");
        const eventsText = t("events");

        // if background sync is enabled and notifcations are on we send a notification
        // instead of using the snackbar
        const standardMessage = `${backgroundSyncText} ${andLoadedText} ${eventCount} ${eventsText}`;
        let extraMessage = "";
        const totalNewEvents =
            newerPaymentCount +
            newerBunqMeTabsCount +
            newerRequestResponsesCount +
            newerRequestInquiriesCount +
            newerMasterCardActionsCount +
            newerShareInviteMonetaryAccountInquiriesCount +
            newerShareInviteMonetaryAccountResponsesCount;

        if (totalNewEvents > 0) {
            extraMessage = `${totalNewEvents} ${newEventsText}`;

            if (this.props.automaticUpdateSendNotification) {
                // create a native notification
                NotificationHelper(backgroundSyncText, extraMessage);
            }

            // send notification to backend for touchbar changes
            ipcRenderer.send("loaded-new-events", totalNewEvents);
        }

        const snackbarMessage = `${standardMessage}${extraMessage ? `, ${extraMessage}` : ""}`;

        // display a message to notify the user
        this.props.openSnackbar(snackbarMessage);

        // trigger an update by changing the finished timestamp
        this.props.queueFinishedSync();

        // force the timer to update
        this.setupTimer(true);

        // reset the events in the queue state
        this.setState({
            payments: {},
            bunqMeTabs: {},
            requestResponses: {},
            requestInquiries: {},
            requestInquiryBatches: {},
            masterCardActions: {},
            shareInviteBankInquiries: {},
            shareInviteMonetaryAccountResponses: []
        });
    };

    /**
     * Checks if the automatic update timer should be set
     * @param forceReset
     */
    setupTimer = (forceReset = false) => {
        if (this.props.automaticUpdateEnabled) {
            if (
                forceReset ||
                (this.automaticUpdateTimerDuration !== null &&
                    this.automaticUpdateTimerDuration !== this.props.automaticUpdateDuration)
            ) {
                this.resetTimer();
            }

            // only set if not already set
            if (!this.automaticUpdateTimer) {
                this.automaticUpdateTimer = setInterval(() => {
                    this.props.queueStartSync();
                }, this.props.automaticUpdateDuration * 1000);

                // store value so we can detect changes
                this.automaticUpdateTimerDuration = this.props.automaticUpdateDuration;
            }
        } else {
            // reset timer since not enabled
            this.resetTimer();
        }
    };

    resetTimer = () => {
        if (this.automaticUpdateTimer) {
            clearInterval(this.automaticUpdateTimer);
            this.automaticUpdateTimer = null;
        }
    };

    paymentsUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.payment
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(payments => {
                // turn plain objects into Model objects
                const paymentsNew = payments.map(item => new Payment(item)).filter(paymentApiFilter);

                const currentPayments = { ...this.state.payments };
                const accountPayments = currentPayments[account_id] || [];

                // update the list for the account id
                currentPayments[account_id] = [...accountPayments, ...paymentsNew];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentPayments).reduce((accumulator, accountId) => {
                    return accumulator + currentPayments[accountId].length;
                }, 0);

                // more payments can be loaded for this account
                if (
                    payments.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestPaymentIndex = paymentsNew.length - 1;
                    const oldestPayment = paymentsNew[oldestPaymentIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the payments to continue deeper into the acocunt
                    this.paymentsUpdate(user_id, account_id, oldestPayment.id, nextEventCount);
                }

                // set these payments in the state
                this.setState({
                    payments: currentPayments
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    bunqMeTabsUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.bunqMeTabs
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(bunqMeTabs => {
                // turn plain objects into Model objects
                const bunqMeTabsNew = bunqMeTabs.map(item => new BunqMeTab(item));

                const currentBunqMeTabs = { ...this.state.bunqMeTabs };
                const accountBunqMeTabs = currentBunqMeTabs[account_id] || [];

                // update the list for the account id
                currentBunqMeTabs[account_id] = [...accountBunqMeTabs, ...bunqMeTabsNew];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentBunqMeTabs).reduce((accumulator, accountId) => {
                    return accumulator + currentBunqMeTabs[accountId].length;
                }, 0);

                // more bunqMeTabs can be loaded for this account
                if (
                    bunqMeTabsNew.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestBunqMeTabIndex = bunqMeTabsNew.length - 1;
                    const oldestBunqMeTab = bunqMeTabsNew[oldestBunqMeTabIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the bunqMeTabs to continue deeper into the acocunt
                    this.bunqMeTabsUpdate(user_id, account_id, oldestBunqMeTab.id, nextEventCount);
                }

                // set these bunqMeTabs in the state
                this.setState({
                    bunqMeTabs: currentBunqMeTabs
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestResponsesUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.requestResponse
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(requestResponses => {
                // turn plain objects into Model objects
                const requestResponsesNew = requestResponses.map(item => new RequestResponse(item));

                const currentRequestResponses = {
                    ...this.state.requestResponses
                };
                const accountRequestResponses = currentRequestResponses[account_id] || [];

                // update the list for the account id
                currentRequestResponses[account_id] = [...accountRequestResponses, ...requestResponsesNew];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentRequestResponses).reduce((accumulator, accountId) => {
                    return accumulator + currentRequestResponses[accountId].length;
                }, 0);

                // more requestResponses can be loaded for this account
                if (
                    requestResponsesNew.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestRequestResponseIndex = requestResponsesNew.length - 1;
                    const oldestRequestResponse = requestResponsesNew[oldestRequestResponseIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the requestResponses to continue deeper into the acocunt
                    this.requestResponsesUpdate(user_id, account_id, oldestRequestResponse.id, nextEventCount);
                }

                // set these requestResponses in the state
                this.setState({
                    requestResponses: currentRequestResponses
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestInquiriesUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.requestInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(requestInquiries => {
                // turn plain objects into Model objects
                const requestInquiriesNew = requestInquiries.map(item => new RequestInquiry(item));

                const currentRequestInquiries = {
                    ...this.state.requestInquiries
                };
                const accountRequestInquiries = currentRequestInquiries[account_id] || [];

                // update the list for the account id
                currentRequestInquiries[account_id] = [...accountRequestInquiries, ...requestInquiriesNew];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentRequestInquiries).reduce((accumulator, accountId) => {
                    return accumulator + currentRequestInquiries[accountId].length;
                }, 0);

                // more requestInquiries can be loaded for this account
                if (
                    requestInquiriesNew.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestRequestInquiryIndex = requestInquiriesNew.length - 1;
                    const oldestRequestInquiry = requestInquiriesNew[oldestRequestInquiryIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the requestInquiries to continue deeper into the acocunt
                    this.requestInquiriesUpdate(user_id, account_id, oldestRequestInquiry.id, nextEventCount);
                }

                // set these requestInquiries in the state
                this.setState({
                    requestInquiries: currentRequestInquiries
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestInquiryBatchesUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.requestInquiryBatch
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(requestInquiryBatches => {
                // turn plain objects into Model objects
                const requestInquiryBatchesNew = requestInquiryBatches.map(item => new RequestInquiryBatch(item));

                const currentRequestInquiryBatches = {
                    ...this.state.requestInquiryBatches
                };
                const accountRequestInquiryBatches = currentRequestInquiryBatches[account_id] || [];

                // update the list for the account id
                currentRequestInquiryBatches[account_id] = [
                    ...accountRequestInquiryBatches,
                    ...requestInquiryBatchesNew
                ];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentRequestInquiryBatches).reduce((accumulator, accountId) => {
                    return accumulator + currentRequestInquiryBatches[accountId].length;
                }, 0);

                // more requestInquiryBatches can be loaded for this account
                if (
                    requestInquiryBatchesNew.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestRequestInquiryIndex = requestInquiryBatchesNew.length - 1;
                    const oldestRequestInquiry = requestInquiryBatchesNew[oldestRequestInquiryIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the requestInquiryBatches to continue deeper into the acocunt
                    this.requestInquiryBatchesUpdate(user_id, account_id, oldestRequestInquiry.id, nextEventCount);
                }

                // set these requestInquiryBatches in the state
                this.setState({
                    requestInquiryBatches: currentRequestInquiryBatches
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    masterCardActionsUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.masterCardAction
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(masterCardActions => {
                // turn plain objects into Model objects
                const masterCardActionsNew = masterCardActions.map(item => new MasterCardAction(item));

                const currentMasterCardActions = {
                    ...this.state.masterCardActions
                };
                const accountMasterCardActions = currentMasterCardActions[account_id] || [];

                // update the list for the account id
                currentMasterCardActions[account_id] = [...accountMasterCardActions, ...masterCardActionsNew];

                // count total events between all accounts
                const totalEventCount = Object.keys(currentMasterCardActions).reduce((accumulator, accountId) => {
                    return accumulator + currentMasterCardActions[accountId].length;
                }, 0);

                // more masterCardActions can be loaded for this account
                if (
                    masterCardActionsNew.length === currentEventCount &&
                    nextEventCount > 0 &&
                    totalEventCount < EVENT_TOTAL_LIMIT
                ) {
                    const oldestMasterCardActionIndex = masterCardActionsNew.length - 1;
                    const oldestMasterCardAction = masterCardActionsNew[oldestMasterCardActionIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the masterCardActions to continue deeper into the acocunt
                    this.masterCardActionsUpdate(user_id, account_id, oldestMasterCardAction.id, nextEventCount);
                }

                // set these masterCardActions in the state
                this.setState({
                    masterCardActions: currentMasterCardActions
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    shareInviteBankInquiriesUpdate = (user_id, account_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.shareInviteMonetaryAccountInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(shareInviteBankInquiries => {
                // more shareInviteBankInquiries can be loaded for this account
                if (shareInviteBankInquiries.length === currentEventCount && nextEventCount > 0) {
                    const oldestShareInviteMonetaryAccountInquiryIndex = shareInviteBankInquiries.length - 1;
                    const oldestShareInviteMonetaryAccountInquiry =
                        shareInviteBankInquiries[oldestShareInviteMonetaryAccountInquiryIndex];

                    // re-run the shareInviteBankInquiries to continue deeper into the acocunt
                    this.shareInviteBankInquiriesUpdate(
                        user_id,
                        oldestShareInviteMonetaryAccountInquiry.id,
                        nextEventCount
                    );
                }

                const currentShareInviteBankInquiries = {
                    ...this.state.shareInviteBankInquiries
                };
                const accountShareInviteBankInquiries = currentShareInviteBankInquiries[account_id] || [];

                // update the list for the account id
                currentShareInviteBankInquiries[account_id] = [
                    ...accountShareInviteBankInquiries,
                    ...shareInviteBankInquiries
                ];

                // set these shareInviteBankInquiries in the state
                this.setState({
                    shareInviteBankInquiries: currentShareInviteBankInquiries
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    shareInviteMonetaryAccountResponsesUpdate = (user_id, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        BunqJSClient.api.shareInviteMonetaryAccountResponse
            .list(user_id, {
                count: eventCount
            })
            .then(shareInviteMonetaryAccountResponses => {
                // set these shareInviteMonetaryAccountResponses in the state
                this.setState({
                    shareInviteMonetaryAccountResponses: shareInviteMonetaryAccountResponses
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    render() {
        return null;
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userLoading: state.user.loading,
        limitedPermissions: state.user.limited_permissions,

        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading,

        syncOnStartup: state.options.sync_on_startup,
        eventCountLimit: state.options.event_count_limit,

        automaticUpdateEnabled: state.options.automatic_update_enabled,
        automaticUpdateSendNotification: state.options.automatic_update_send_notification,
        automaticUpdateDuration: state.options.automatic_update_duration,

        queueRequestCounter: state.queue.request_counter,
        queueTriggerSync: state.queue.trigger_sync,
        queueLoading: state.queue.loading,

        payments: state.payments.payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        masterCardActions: state.master_card_actions.master_card_actions,
        requestInquiries: state.request_inquiries.request_inquiries,
        requestInquiryBatches: state.request_inquiry_batches.request_inquiry_batches,
        requestResponses: state.request_responses.request_responses,
        shareInviteBankInquiries: state.share_invite_monetary_account_inquiries.share_invite_monetary_account_inquiries,
        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: (message, duration = 4000) => dispatch(openSnackbar(message, duration)),

        queueDecreaseRequestCounter: () => dispatch(queueDecreaseRequestCounter()),
        queueIncreaseRequestCounter: () => dispatch(queueIncreaseRequestCounter()),
        queueSetRequestCounter: counter => dispatch(queueSetRequestCounter(counter)),
        queueStartSync: () => dispatch(queueStartSync()),
        queueFinishedSync: () => dispatch(queueFinishedSync()),
        queueResetSyncState: () => dispatch(queueResetSyncState()),

        paymentsSetInfo: (payments, accountId) => dispatch(paymentsSetInfo(payments, accountId, false, BunqJSClient)),
        bunqMeTabsSetInfo: (bunqMeTabs, accountId) =>
            dispatch(bunqMeTabsSetInfo(bunqMeTabs, accountId, false, BunqJSClient)),
        masterCardActionsSetInfo: (masterCardActions, accountId) =>
            dispatch(masterCardActionsSetInfo(masterCardActions, accountId, false, BunqJSClient)),
        requestInquiriesSetInfo: (requestInquiries, accountId) =>
            dispatch(requestInquiriesSetInfo(requestInquiries, accountId, false, BunqJSClient)),
        requestInquiryBatchesSetInfo: (requestInquiryBatches, accountId) =>
            dispatch(requestInquiryBatchesSetInfo(requestInquiryBatches, accountId, false, BunqJSClient)),
        requestResponsesSetInfo: (requestResponses, accountId) =>
            dispatch(requestResponsesSetInfo(requestResponses, accountId, false, BunqJSClient)),
        shareInviteBankInquiriesSetInfo: (shareInviteBankInquiries, accountId) =>
            dispatch(shareInviteBankInquiriesSetInfo(shareInviteBankInquiries, accountId, BunqJSClient)),
        shareInviteMonetaryAccountResponsesSetInfo: shareInviteMonetaryAccountResponses =>
            dispatch(shareInviteMonetaryAccountResponsesSetInfo(shareInviteMonetaryAccountResponses, BunqJSClient))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(QueueManager));

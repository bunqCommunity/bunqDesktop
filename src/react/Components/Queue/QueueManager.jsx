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

import NotificationHelper from "../../Helpers/NotificationHelper";

import { openSnackbar } from "../../Actions/snackbar";
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
import { shareInviteBankInquiriesSetInfo } from "../../Actions/share_invite_bank_inquiries";

export const REQUEST_DEPTH_LIMIT = 1;

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
            shareInviteBankInquiries: {}
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
        if (syncOnStartup === false && this.state.initialSync === false) {
            this.setState({ initialSync: true });
        }

        if (queueLoading && queueTriggerSync) {
            this.props.queueResetSyncState();
        }

        // no initial sync completed or manual sync was triggered
        if (!this.state.initialSync || queueTriggerSync) {
            if (user && !queueLoading && !userLoading && accounts && !accountsLoading && accounts.length > 0) {
                // if we continue, limit deep search to 5
                const continueCount = queueTriggerSync !== false ? REQUEST_DEPTH_LIMIT : false;

                // clear existing timeout if it exists
                if (this.delayedQueue) clearTimeout(this.delayedQueue);
                // delay the queue update
                this.delayedQueue = setTimeout(() => this.triggerQueueUpdate(continueCount), 100);
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
    triggerQueueUpdate = (continueLoading = false) => {
        const { queueTriggerSync, accounts, user, limitedPermissions } = this.props;

        if (queueTriggerSync) this.props.queueResetSyncState();

        if (!user || !accounts) {
            return;
        }

        // ensure initial sync is true to avoid endless syncs
        const userId = user.id;
        this.setState({
            initialSync: true
        });

        // only include active accounts
        const filteredAccounts = accounts.filter(account => {
            return account.status === "ACTIVE";
        });

        const requestsPerAccount = limitedPermissions ? 6 : 7;
        const bufferedCounter = filteredAccounts.length * requestsPerAccount;

        // set initial request count in one go
        this.props.queueSetRequestCounter(bufferedCounter);

        filteredAccounts.forEach(account => {
            const accountId = account.id;

            this.paymentsUpdate(userId, accountId, false, continueLoading);
            this.bunqMeTabsUpdate(userId, accountId, false, continueLoading);
            this.requestResponsesUpdate(userId, accountId, false, continueLoading);
            this.requestInquiriesUpdate(userId, accountId, false, continueLoading);
            this.requestInquiryBatchesUpdate(userId, accountId, false, continueLoading);
            this.masterCardActionsUpdate(userId, accountId, false, continueLoading);

            if (!limitedPermissions) {
                this.shareInviteBankInquiriesUpdate(userId, accountId, false, continueLoading);
            }
        });
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
        let newerShareInviteBankInquiriesCount = 0;
        filteredAccounts.forEach(account => {
            // get events for this account and fallback to empty list
            const payments = this.state.payments[account.id] || [];
            const bunqMeTabs = this.state.bunqMeTabs[account.id] || [];
            const requestResponses = this.state.requestResponses[account.id] || [];
            const requestInquiries = this.state.requestInquiries[account.id] || [];
            const requestInquiryBatches = this.state.requestInquiryBatches[account.id] || [];
            const masterCardActions = this.state.masterCardActions[account.id] || [];
            const shareInviteBankInquiries = this.state.shareInviteBankInquiries[account.id] || [];

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

            const newestShareInviteBankInquiry = this.props.shareInviteBankInquiries.find(
                shareInviteBankInquiry => account.id === shareInviteBankInquiry.monetary_account_id
            );
            if (newestShareInviteBankInquiry)
                newerShareInviteBankInquiriesCount += shareInviteBankInquiries.filter(
                    shareInviteBankInquiry => shareInviteBankInquiry.id > newestShareInviteBankInquiry.id
                ).length;

            // count the total amount of events
            eventCount += payments.length;
            eventCount += bunqMeTabs.length;
            eventCount += requestResponses.length;
            eventCount += requestInquiries.length;
            eventCount += masterCardActions.length;
            eventCount += shareInviteBankInquiries.length;

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
            newerShareInviteBankInquiriesCount;

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
            shareInviteBankInquiries: {}
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

    paymentsUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.payment
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(payments => {
                // turn plain objects into Model objects
                const paymentsNew = payments.map(item => new Payment(item));

                // more payments can be loaded for this account
                if (paymentsNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestPaymentIndex = paymentsNew.length - 1;
                    const oldestPayment = paymentsNew[oldestPaymentIndex];

                    // re-run the payments to continue deeper into the acocunt
                    this.paymentsUpdate(user_id, account_id, oldestPayment.id, continueLoading - 1);
                }

                const currentPayments = { ...this.state.payments };
                const accountPayments = currentPayments[account_id] || [];

                // merge existing and new
                const mergedPayments = [...accountPayments, ...paymentsNew];

                // update the list for the account id
                currentPayments[account_id] = mergedPayments;

                // set these payments in the state
                this.setState({
                    payments: currentPayments
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    bunqMeTabsUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.bunqMeTabs
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(bunqMeTabs => {
                // turn plain objects into Model objects
                const bunqMeTabsNew = bunqMeTabs.map(item => new BunqMeTab(item));

                // more bunqMeTabs can be loaded for this account
                if (bunqMeTabsNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestBunqMeTabIndex = bunqMeTabsNew.length - 1;
                    const oldestBunqMeTab = bunqMeTabsNew[oldestBunqMeTabIndex];

                    // re-run the bunqMeTabs to continue deeper into the acocunt
                    this.bunqMeTabsUpdate(user_id, account_id, oldestBunqMeTab.id, continueLoading - 1);
                }

                const currentBunqMeTabs = { ...this.state.bunqMeTabs };
                const accountBunqMeTabs = currentBunqMeTabs[account_id] || [];

                // merge existing and new
                const mergedBunqMeTabs = [...accountBunqMeTabs, ...bunqMeTabsNew];

                // update the list for the account id
                currentBunqMeTabs[account_id] = mergedBunqMeTabs;

                // set these bunqMeTabs in the state
                this.setState({
                    bunqMeTabs: currentBunqMeTabs
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestResponsesUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.requestResponse
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(requestResponses => {
                // turn plain objects into Model objects
                const requestResponsesNew = requestResponses.map(item => new RequestResponse(item));

                // more requestResponses can be loaded for this account
                if (requestResponsesNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestRequestResponseIndex = requestResponsesNew.length - 1;
                    const oldestRequestResponse = requestResponsesNew[oldestRequestResponseIndex];

                    // re-run the requestResponses to continue deeper into the acocunt
                    this.requestResponsesUpdate(user_id, account_id, oldestRequestResponse.id, continueLoading - 1);
                }

                const currentRequestResponses = {
                    ...this.state.requestResponses
                };
                const accountRequestResponses = currentRequestResponses[account_id] || [];

                // merge existing and new
                const mergedRequestResponses = [...accountRequestResponses, ...requestResponsesNew];

                // update the list for the account id
                currentRequestResponses[account_id] = mergedRequestResponses;

                // set these requestResponses in the state
                this.setState({
                    requestResponses: currentRequestResponses
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestInquiriesUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.requestInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(requestInquiries => {
                // turn plain objects into Model objects
                const requestInquiriesNew = requestInquiries.map(item => new RequestInquiry(item));

                // more requestInquiries can be loaded for this account
                if (requestInquiriesNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestRequestInquiryIndex = requestInquiriesNew.length - 1;
                    const oldestRequestInquiry = requestInquiriesNew[oldestRequestInquiryIndex];

                    // re-run the requestInquiries to continue deeper into the acocunt
                    this.requestInquiriesUpdate(user_id, account_id, oldestRequestInquiry.id, continueLoading - 1);
                }

                const currentRequestInquiries = {
                    ...this.state.requestInquiries
                };
                const accountRequestInquiries = currentRequestInquiries[account_id] || [];

                // merge existing and new
                const mergedRequestInquiries = [...accountRequestInquiries, ...requestInquiriesNew];

                // update the list for the account id
                currentRequestInquiries[account_id] = mergedRequestInquiries;

                // set these requestInquiries in the state
                this.setState({
                    requestInquiries: currentRequestInquiries
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    requestInquiryBatchesUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.requestInquiryBatch
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(requestInquiryBatches => {
                // turn plain objects into Model objects
                const requestInquiryBatchesNew = requestInquiryBatches.map(item => new RequestInquiryBatch(item));

                // more requestInquiryBatches can be loaded for this account
                if (requestInquiryBatchesNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestRequestInquiryIndex = requestInquiryBatchesNew.length - 1;
                    const oldestRequestInquiry = requestInquiryBatchesNew[oldestRequestInquiryIndex];

                    // re-run the requestInquiryBatches to continue deeper into the acocunt
                    this.requestInquiryBatchesUpdate(user_id, account_id, oldestRequestInquiry.id, continueLoading - 1);
                }

                const currentRequestInquiryBatches = {
                    ...this.state.requestInquiryBatches
                };
                const accountRequestInquiryBatches = currentRequestInquiryBatches[account_id] || [];

                // merge existing and new
                const mergedRequestInquiryBatches = [...accountRequestInquiryBatches, ...requestInquiryBatchesNew];

                // update the list for the account id
                currentRequestInquiryBatches[account_id] = mergedRequestInquiryBatches;

                // set these requestInquiryBatches in the state
                this.setState({
                    requestInquiryBatches: currentRequestInquiryBatches
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    masterCardActionsUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.masterCardAction
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(masterCardActions => {
                // turn plain objects into Model objects
                const masterCardActionsNew = masterCardActions.map(item => new MasterCardAction(item));

                // more masterCardActions can be loaded for this account
                if (masterCardActionsNew.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestMasterCardActionIndex = masterCardActionsNew.length - 1;
                    const oldestMasterCardAction = masterCardActionsNew[oldestMasterCardActionIndex];

                    // re-run the masterCardActions to continue deeper into the acocunt
                    this.masterCardActionsUpdate(user_id, account_id, oldestMasterCardAction.id, continueLoading - 1);
                }

                const currentMasterCardActions = {
                    ...this.state.masterCardActions
                };
                const accountMasterCardActions = currentMasterCardActions[account_id] || [];

                // merge existing and new
                const mergedMasterCardActions = [...accountMasterCardActions, ...masterCardActionsNew];

                // update the list for the account id
                currentMasterCardActions[account_id] = mergedMasterCardActions;

                // set these masterCardActions in the state
                this.setState({
                    masterCardActions: currentMasterCardActions
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    shareInviteBankInquiriesUpdate = (user_id, account_id, olderId = false, continueLoading = false) => {
        const { BunqJSClient } = this.props;

        if (olderId !== false) this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.shareInviteBankInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(shareInviteBankInquiries => {
                // more shareInviteBankInquiries can be loaded for this account
                if (shareInviteBankInquiries.length === 200 && (continueLoading !== false && continueLoading > 0)) {
                    const oldestShareInviteBankInquiryIndex = shareInviteBankInquiries.length - 1;
                    const oldestShareInviteBankInquiry = shareInviteBankInquiries[oldestShareInviteBankInquiryIndex];

                    // re-run the shareInviteBankInquiries to continue deeper into the acocunt
                    this.shareInviteBankInquiriesUpdate(
                        user_id,
                        account_id,
                        oldestShareInviteBankInquiry.id,
                        continueLoading - 1
                    );
                }

                const currentShareInviteBankInquiries = {
                    ...this.state.shareInviteBankInquiries
                };
                const accountShareInviteBankInquiries = currentShareInviteBankInquiries[account_id] || [];

                // merge existing and new
                const mergedShareInviteBankInquiries = [
                    ...accountShareInviteBankInquiries,
                    ...shareInviteBankInquiries
                ];

                // update the list for the account id
                currentShareInviteBankInquiries[account_id] = mergedShareInviteBankInquiries;

                // set these shareInviteBankInquiries in the state
                this.setState({
                    shareInviteBankInquiries: currentShareInviteBankInquiries
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
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
        shareInviteBankInquiries: state.share_invite_bank_inquiries.share_invite_bank_inquiries
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
            dispatch(shareInviteBankInquiriesSetInfo(shareInviteBankInquiries, accountId, false, BunqJSClient))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(QueueManager));

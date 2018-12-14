import React from "react";
import { ipcRenderer } from "electron";
import { translate } from "react-i18next";
import { connect } from "react-redux";

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
import { eventsSetInfo } from "../../Actions/events";
import { openSnackbar } from "../../Actions/snackbar";
import { shareInviteBankResponsesSetInfo } from "../../Actions/share_invite_bank_responses";

export const DEFAULT_EVENT_COUNT_LIMIT = 200;
export const EVENT_TOTAL_LIMIT = 1000;

class QueueManager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialSync: false,

            events: [],
            shareInviteBankResponses: []
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
        const { queueTriggerSync, accounts, user } = this.props;

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

        this.shareInviteBankResponsesUpdate(userId);
        this.eventsUpdate(userId, false, eventCount);

        this.props.queueSetRequestCounter(2);
    };

    /**
     * Pushes the data collected in the queue to the actual app state
     */
    pushQueueData = () => {
        const events = this.state.events || [];
        const shareInviteBankResponses = this.state.shareInviteBankResponses || [];

        // count the new events for each type and account
        let newerEventCount = 0;
        const newestStoredEvent = this.props.events[0];
        if (newestStoredEvent) {
            newerEventCount = events.filter(event => event.id > newestStoredEvent.id).length;
        }

        // set the info into the application state
        if (events.length > 0) {
            this.props.eventsSetInfo(events);
        }
        if (shareInviteBankResponses.length > 0) {
            this.props.shareInviteBankResponsesSetInfo(shareInviteBankResponses);
        }

        const t = this.props.t;
        const backgroundSyncText = t("Background sync finished");
        const newEventsText = t("new events were found!");
        const andLoadedText = t("and loaded");
        const eventsText = t("events");

        // if background sync is enabled and notifcations are on we send a notification
        // instead of using the snackbar
        const standardMessage = `${backgroundSyncText} ${andLoadedText} ${events.length} ${eventsText}`;
        let extraMessage = "";

        if (newerEventCount > 0) {
            extraMessage = `${newerEventCount} ${newEventsText}`;

            if (this.props.automaticUpdateSendNotification) {
                // create a native notification
                NotificationHelper(backgroundSyncText, extraMessage);
            }

            // send notification to backend for touchbar changes
            ipcRenderer.send("loaded-new-events", events.length);
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
            events: [],
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

    eventsUpdate = (user_id, olderId = false, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        const currentEventCount = eventCount > 200 ? 200 : eventCount;
        const nextEventCount = eventCount > 200 ? eventCount - 200 : 0;
        BunqJSClient.api.event
            .list(user_id, {
                older_id: olderId,
                count: currentEventCount
            })
            .then(events => {
                let currentEvents = [...this.state.events];

                // update the list for the account id
                currentEvents = [...currentEvents, ...events];

                // count total events between all accounts
                const totalEventCount = currentEvents.length;

                // more events can be loaded for this account
                if (events.length === currentEventCount && nextEventCount > 0 && totalEventCount < EVENT_TOTAL_LIMIT) {
                    const oldestEventIndex = events.length - 1;
                    const oldestEvent = events[oldestEventIndex];

                    this.props.queueIncreaseRequestCounter();

                    // re-run the events to continue deeper into the acocunt
                    this.eventsUpdate(user_id, oldestEvent.Event.id, nextEventCount);
                }

                // set these events in the state
                this.setState({
                    events: currentEvents
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(() => {
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };

    shareInviteBankResponsesUpdate = (user_id, eventCount = 200) => {
        const { BunqJSClient } = this.props;

        BunqJSClient.api.shareInviteBankResponse
            .list(user_id, {
                count: eventCount
            })
            .then(shareInviteBankResponses => {
                // set these shareInviteBankResponses in the state
                this.setState({
                    shareInviteBankResponses: shareInviteBankResponses
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

        events: state.events.events,
        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses
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

        eventsSetInfo: events => dispatch(eventsSetInfo(events, false, BunqJSClient)),
        shareInviteBankResponsesSetInfo: shareInviteBankResponses =>
            dispatch(shareInviteBankResponsesSetInfo(shareInviteBankResponses, BunqJSClient))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(QueueManager));

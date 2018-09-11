import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import SyncIcon from "@material-ui/icons/Sync";

import Payment from "../Models/Payment";
import BunqMeTab from "../Models/BunqMeTab";
import RequestResponse from "../Models/RequestResponse";
import RequestInquiry from "../Models/RequestInquiry";
import MasterCardAction from "../Models/MasterCardAction";

import { openSnackbar } from "../Actions/snackbar";
import {
    queueDecreaseRequestCounter,
    queueIncreaseRequestCounter
} from "../Actions/queue";
import { paymentsSetInfo } from "../Actions/payments";
import { bunqMeTabsSetInfo } from "../Actions/bunq_me_tabs";
import { masterCardActionsSetInfo } from "../Actions/master_card_actions";
import { requestInquiriesSetInfo } from "../Actions/request_inquiries";
import { requestResponsesSetInfo } from "../Actions/request_responses";
import { shareInviteBankInquiriesSetInfo } from "../Actions/share_invite_bank_inquiries";

class QueueManager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialSync: false,

            payments: {},
            bunqMeTabs: {},
            requestResponses: {},
            requestInquiries: {},
            masterCardActions: {},
            shareInviteBankInquiries: {}
        };

        this.delayedQueue = null;
        this.delayedSetState = null;
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            accounts,
            accountsLoading,
            user,
            userLoading,
            queueLoading,
            queueRequestCounter
        } = this.props;

        if (!this.state.initialSync) {
            if (
                user &&
                !userLoading &&
                accounts &&
                !accountsLoading &&
                accounts.length > 0
            ) {
                // clear existing timeout if it exists
                if (this.delayedQueue) clearTimeout(this.delayedQueue);
                // delay the queue update
                this.delayedQueue = setTimeout(
                    () => this.triggerQueueUpdate(false),
                    2500
                );
            }
        } else {
            if (
                !queueLoading &&
                prevProps.queueLoading === true &&
                queueRequestCounter === 0
            ) {
                // clear existing timeout if it exists
                if (this.delayedSetState) clearTimeout(this.delayedSetState);
                // delay the queue update
                this.delayedSetState = setTimeout(this.pushQueueData, 1000);
            }
        }
    }

    /**
     * Triggers the actual background sync for all monetary accounts
     * @param continueLoading
     */
    triggerQueueUpdate = (continueLoading = false) => {
        const { accounts, user, limitedPermissions } = this.props;

        const userId = user.id;
        this.setState({
            initialSync: true
        });

        accounts.forEach(account => {
            const accountId = account.id;

            this.paymentsUpdate(userId, accountId, false, continueLoading);
            this.bunqMeTabsUpdate(userId, accountId, false, continueLoading);
            this.requestResponsesUpdate(
                userId,
                accountId,
                false,
                continueLoading
            );
            this.requestInquiriesUpdate(
                userId,
                accountId,
                false,
                continueLoading
            );
            this.masterCardActionsUpdate(
                userId,
                accountId,
                false,
                continueLoading
            );

            if (!limitedPermissions) {
                this.shareInviteBankInquiriesUpdate(
                    userId,
                    accountId,
                    false,
                    continueLoading
                );
            }
        });
    };

    /**
     * Pushes the data collected in the queue to the actual app state
     */
    pushQueueData = () => {
        const { accounts } = this.props;
        let eventCount = 0;

        accounts.forEach(account => {
            // get events for this account and fallback to empty list
            const payments = this.state.payments[account.id] || [];
            const bunqMeTabs = this.state.bunqMeTabs[account.id] || [];
            const requestResponses =
                this.state.requestResponses[account.id] || [];
            const requestInquiries =
                this.state.requestInquiries[account.id] || [];
            const masterCardActions =
                this.state.masterCardActions[account.id] || [];
            const shareInviteBankInquiries =
                this.state.shareInviteBankInquiries[account.id] || [];

            // count the total amount of events
            eventCount += payments.length;
            eventCount += bunqMeTabs.length;
            eventCount += requestResponses.length;
            eventCount += requestInquiries.length;
            eventCount += masterCardActions.length;
            eventCount += shareInviteBankInquiries.length;

            // set the info into the application state
            if (payments.length > 0)
                this.props.paymentsSetInfo(payments, account.id);
            if (bunqMeTabs.length > 0)
                this.props.bunqMeTabsSetInfo(bunqMeTabs, account.id);
            if (requestResponses.length > 0)
                this.props.requestResponsesSetInfo(
                    requestResponses,
                    account.id
                );
            if (requestInquiries.length > 0)
                this.props.requestInquiriesSetInfo(
                    requestInquiries,
                    account.id
                );
            if (masterCardActions.length > 0)
                this.props.masterCardActionsSetInfo(
                    masterCardActions,
                    account.id
                );
            if (shareInviteBankInquiries.length > 0)
                this.props.shareInviteBankInquiriesSetInfo(
                    shareInviteBankInquiries,
                    account.id
                );
        });

        const mainText = this.props.t("Background sync finished and loaded");
        const eventsText = this.props.t("events");
        const resultMessage = `${mainText} ${eventCount} ${eventsText}`;

        this.props.openSnackbar(resultMessage);

        // reset the events in the queue state
        this.setState({
            payments: {},
            bunqMeTabs: {},
            requestResponses: {},
            requestInquiries: {},
            masterCardActions: {},
            shareInviteBankInquiries: {}
        });
    };

    paymentsUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.payment
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(payments => {
                // turn plain objects into Model objects
                const paymentsNew = payments.map(item => new Payment(item));

                // more payments can be loaded for this account
                if (paymentsNew.length === 200 && continueLoading === true) {
                    const oldestPaymentIndex = paymentsNew.length - 1;
                    const oldestPayment = paymentsNew[oldestPaymentIndex];

                    // re-run the payments to continue deeper into the acocunt
                    this.paymentsUpdate(user_id, account_id, oldestPayment.id);
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

    bunqMeTabsUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.bunqMeTabs
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(bunqMeTabs => {
                // turn plain objects into Model objects
                const bunqMeTabsNew = bunqMeTabs.map(
                    item => new BunqMeTab(item)
                );

                // more bunqMeTabs can be loaded for this account
                if (bunqMeTabsNew.length === 200 && continueLoading === true) {
                    const oldestBunqMeTabIndex = bunqMeTabsNew.length - 1;
                    const oldestBunqMeTab = bunqMeTabsNew[oldestBunqMeTabIndex];

                    // re-run the bunqMeTabs to continue deeper into the acocunt
                    this.bunqMeTabsUpdate(
                        user_id,
                        account_id,
                        oldestBunqMeTab.id
                    );
                }

                const currentBunqMeTabs = { ...this.state.bunqMeTabs };
                const accountBunqMeTabs = currentBunqMeTabs[account_id] || [];

                // merge existing and new
                const mergedBunqMeTabs = [
                    ...accountBunqMeTabs,
                    ...bunqMeTabsNew
                ];

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

    requestResponsesUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.requestResponse
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(requestResponses => {
                // turn plain objects into Model objects
                const requestResponsesNew = requestResponses.map(
                    item => new RequestResponse(item)
                );

                // more requestResponses can be loaded for this account
                if (
                    requestResponsesNew.length === 200 &&
                    continueLoading === true
                ) {
                    const oldestRequestResponseIndex =
                        requestResponsesNew.length - 1;
                    const oldestRequestResponse =
                        requestResponsesNew[oldestRequestResponseIndex];

                    // re-run the requestResponses to continue deeper into the acocunt
                    this.requestResponsesUpdate(
                        user_id,
                        account_id,
                        oldestRequestResponse.id
                    );
                }

                const currentRequestResponses = {
                    ...this.state.requestResponses
                };
                const accountRequestResponses =
                    currentRequestResponses[account_id] || [];

                // merge existing and new
                const mergedRequestResponses = [
                    ...accountRequestResponses,
                    ...requestResponsesNew
                ];

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

    requestInquiriesUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.requestInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(requestInquiries => {
                // turn plain objects into Model objects
                const requestInquiriesNew = requestInquiries.map(
                    item => new RequestInquiry(item)
                );

                // more requestInquiries can be loaded for this account
                if (
                    requestInquiriesNew.length === 200 &&
                    continueLoading === true
                ) {
                    const oldestRequestInquiryIndex =
                        requestInquiriesNew.length - 1;
                    const oldestRequestInquiry =
                        requestInquiriesNew[oldestRequestInquiryIndex];

                    // re-run the requestInquiries to continue deeper into the acocunt
                    this.requestInquiriesUpdate(
                        user_id,
                        account_id,
                        oldestRequestInquiry.id
                    );
                }

                const currentRequestInquiries = {
                    ...this.state.requestInquiries
                };
                const accountRequestInquiries =
                    currentRequestInquiries[account_id] || [];

                // merge existing and new
                const mergedRequestInquiries = [
                    ...accountRequestInquiries,
                    ...requestInquiriesNew
                ];

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

    masterCardActionsUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.masterCardAction
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(masterCardActions => {
                // turn plain objects into Model objects
                const masterCardActionsNew = masterCardActions.map(
                    item => new MasterCardAction(item)
                );

                // more masterCardActions can be loaded for this account
                if (
                    masterCardActionsNew.length === 200 &&
                    continueLoading === true
                ) {
                    const oldestMasterCardActionIndex =
                        masterCardActionsNew.length - 1;
                    const oldestMasterCardAction =
                        masterCardActionsNew[oldestMasterCardActionIndex];

                    // re-run the masterCardActions to continue deeper into the acocunt
                    this.masterCardActionsUpdate(
                        user_id,
                        account_id,
                        oldestMasterCardAction.id
                    );
                }

                const currentMasterCardActions = {
                    ...this.state.masterCardActions
                };
                const accountMasterCardActions =
                    currentMasterCardActions[account_id] || [];

                // merge existing and new
                const mergedMasterCardActions = [
                    ...accountMasterCardActions,
                    ...masterCardActionsNew
                ];

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

    shareInviteBankInquiriesUpdate = (
        user_id,
        account_id,
        olderId = false,
        continueLoading = false
    ) => {
        const { BunqJSClient } = this.props;

        this.props.queueIncreaseRequestCounter();

        BunqJSClient.api.shareInviteBankInquiry
            .list(user_id, account_id, {
                older_id: olderId,
                count: 200
            })
            .then(shareInviteBankInquiries => {
                // more shareInviteBankInquiries can be loaded for this account
                if (
                    shareInviteBankInquiries.length === 200 &&
                    continueLoading === true
                ) {
                    const oldestShareInviteBankInquiryIndex =
                        shareInviteBankInquiries.length - 1;
                    const oldestShareInviteBankInquiry =
                        shareInviteBankInquiries[
                            oldestShareInviteBankInquiryIndex
                        ];

                    // re-run the shareInviteBankInquiries to continue deeper into the acocunt
                    this.shareInviteBankInquiriesUpdate(
                        user_id,
                        account_id,
                        oldestShareInviteBankInquiry.id
                    );
                }

                const currentShareInviteBankInquiries = {
                    ...this.state.shareInviteBankInquiries
                };
                const accountShareInviteBankInquiries =
                    currentShareInviteBankInquiries[account_id] || [];

                // merge existing and new
                const mergedShareInviteBankInquiries = [
                    ...accountShareInviteBankInquiries,
                    ...shareInviteBankInquiries
                ];

                // update the list for the account id
                currentShareInviteBankInquiries[
                    account_id
                ] = mergedShareInviteBankInquiries;

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
        return (
            <div>
                <IconButton
                    style={this.props.style}
                    disabled={this.props.queueLoading}
                >
                    {this.props.queueLoading ? (
                        <Badge
                            badgeContent={this.props.queueRequestCounter}
                            color="primary"
                        >
                            <CircularProgress size={20} />
                        </Badge>
                    ) : (
                        <SyncIcon />
                    )}
                </IconButton>
                <IconButton
                    style={this.props.style}
                    disabled={this.props.queueLoading}
                >
                    {this.props.queueLoading ? (
                        <Badge
                            badgeContent={this.props.queueRequestCounter}
                            color="secondary"
                        >
                            <CircularProgress size={20} />
                        </Badge>
                    ) : (
                        <SyncIcon />
                    )}
                </IconButton>
            </div>
        );
        return (
            <IconButton
                style={this.props.style}
                disabled={this.props.queueLoading}
                onClick={e => this.triggerQueueUpdate(true)}
            >
                {this.props.queueLoading ? (
                    <Badge
                        badgeContent={this.props.queueRequestCounter}
                        color="primary"
                    >
                        <CircularProgress size={20} />
                    </Badge>
                ) : (
                    <SyncIcon />
                )}
            </IconButton>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userLoading: state.user.loading,
        limitedPermissions: state.user.limited_permissions,

        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading,

        queueRequestCounter: state.queue.request_counter,
        queueLoading: state.queue.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration)),

        queueDecreaseRequestCounter: () =>
            dispatch(queueDecreaseRequestCounter()),
        queueIncreaseRequestCounter: () =>
            dispatch(queueIncreaseRequestCounter()),

        paymentsSetInfo: (payments, accountId) =>
            dispatch(paymentsSetInfo(payments, accountId, false, BunqJSClient)),
        bunqMeTabsSetInfo: (bunqMeTabs, accountId) =>
            dispatch(
                bunqMeTabsSetInfo(bunqMeTabs, accountId, false, BunqJSClient)
            ),
        masterCardActionsSetInfo: (masterCardActions, accountId) =>
            dispatch(
                masterCardActionsSetInfo(
                    masterCardActions,
                    accountId,
                    false,
                    BunqJSClient
                )
            ),
        requestInquiriesSetInfo: (requestInquiries, accountId) =>
            dispatch(
                requestInquiriesSetInfo(
                    requestInquiries,
                    accountId,
                    false,
                    BunqJSClient
                )
            ),
        requestResponsesSetInfo: (requestResponses, accountId) =>
            dispatch(
                requestResponsesSetInfo(
                    requestResponses,
                    accountId,
                    false,
                    BunqJSClient
                )
            ),
        shareInviteBankInquiriesSetInfo: (
            shareInviteBankInquiries,
            accountId
        ) =>
            dispatch(
                shareInviteBankInquiriesSetInfo(
                    shareInviteBankInquiries,
                    accountId,
                    false,
                    BunqJSClient
                )
            )
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(QueueManager));

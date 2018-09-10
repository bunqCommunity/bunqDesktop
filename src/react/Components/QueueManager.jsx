import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import Payment from "../Models/Payment";

import { openSnackbar } from "../Actions/snackbar";
import {
    queueDecreaseRequestCounter,
    queueIncreaseRequestCounter
} from "../Actions/queue";

class QueueManager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialSync: false,

            payments: [],
            bunqMeTabs: [],
            requestResponses: [],
            requestInquiries: [],
            masterCardActions: []
        };

        this.delayedQueue = null;
    }

    componentDidUpdate() {
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
                this.delayedQueue = setTimeout(this.triggerQueueUpdate, 5000);
            }
        } else {
            if (!queueLoading) {
            }
        }
    }

    triggerQueueUpdate = () => {
        const { accounts, user } = this.props;
        console.info("Started sync");

        const userId = user.id;
        this.setState({
            initialSync: true
        });

        accounts.forEach(account => {
            const accountId = account.id;

            this.paymentsUpdate(userId, accountId);
            this.bunqMeTabsUpdate(userId, accountId);
            this.requestResponsesUpdate(userId, accountId);
            this.requestInquiriesUpdate(userId, accountId);
            this.masterCardActionsUpdate(userId, accountId);

            if (!this.props.limitedPermissions) {
                this.shareInviteBankInquiriesInfoUpdate(userId, accountId);
            }
        });
    };

    paymentsUpdate = (user_id, account_id, olderId = false) => {
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
                if (paymentsNew.length === 200) {
                    const oldestPaymentIndex = paymentsNew.length - 1;
                    const oldestPayment = paymentsNew[oldestPaymentIndex];

                    // re-run the payments to continue deeper into the acocunt
                    this.paymentsUpdate(user_id, account_id, oldestPayment.id);
                }

                // set these payments in the state
                this.setState({
                    payments: [...this.state.payments, ...paymentsNew]
                });

                // decrease the request count since this request is done
                this.props.queueDecreaseRequestCounter();
            })
            .catch(error => {
                console.error(error);
                // ignore errors
                this.props.queueDecreaseRequestCounter();
            });
    };
    bunqMeTabsUpdate = () => {
        this.props.queueIncreaseRequestCounter();

        setTimeout(() => {
            this.props.queueDecreaseRequestCounter();
        }, 1000 * Math.random());
    };
    requestResponsesUpdate = () => {
        this.props.queueIncreaseRequestCounter();

        setTimeout(() => {
            this.props.queueDecreaseRequestCounter();
        }, 1000 * Math.random());
    };
    requestInquiriesUpdate = () => {
        this.props.queueIncreaseRequestCounter();

        setTimeout(() => {
            this.props.queueDecreaseRequestCounter();
        }, 1000 * Math.random());
    };
    masterCardActionsUpdate = () => {
        this.props.queueIncreaseRequestCounter();

        setTimeout(() => {
            this.props.queueDecreaseRequestCounter();
        }, 1000 * Math.random());
    };

    shareInviteBankInquiriesInfoUpdate = () => {
        this.props.queueIncreaseRequestCounter();

        setTimeout(() => {
            this.props.queueDecreaseRequestCounter();
        }, 1000 * Math.random());
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

        queueRequestCounter: state.queue.request_counter,
        queueLoading: state.queue.loading,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        masterCardActionsLoading: state.master_card_actions.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading,
        shareInviteBankInquiriesLoading:
            state.share_invite_bank_inquiries.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        dispatch: dispatch,

        queueDecreaseRequestCounter: () =>
            dispatch(queueDecreaseRequestCounter()),
        queueIncreaseRequestCounter: () =>
            dispatch(queueIncreaseRequestCounter()),

        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(QueueManager));

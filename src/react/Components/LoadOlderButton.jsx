import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";

import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";

class LoadOlderButton extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    update = event => {
        const {
            accountsAccountId,
            paymentsAccountId,
            paymentsLoading,
            paymentsOlderId,
            bunqMeTabsOlderId,
            requestResponsesOlderId,
            requestInquiriesOlderId,
            masterCardActionsOlderId,
            initialBunqConnect,
            user
        } = this.props;

        if (!initialBunqConnect) {
            return;
        }
        // check if the stored selected account isn't already loaded
        if (
            user.id &&
            accountsAccountId !== false &&
            accountsAccountId !== paymentsAccountId &&
            paymentsLoading === false
        ) {
            this.props.paymentsUpdate(
                user.id,
                accountsAccountId,
                paymentsOlderId
            );
            this.props.bunqMeTabsUpdate(
                user.id,
                accountsAccountId,
                bunqMeTabsOlderId
            );
            this.props.requestResponsesUpdate(
                user.id,
                accountsAccountId,
                requestResponsesOlderId
            );
            this.props.requestInquiriesUpdate(
                user.id,
                accountsAccountId,
                requestInquiriesOlderId
            );
            this.props.masterCardActionsUpdate(
                user.id,
                accountsAccountId,
                masterCardActionsOlderId
            );
        }
    };

    render() {
        const loadingState =
            this.props.paymentsLoading ||
            this.props.bunqMeTabsLoading ||
            this.props.requestResponsesLoading ||
            this.props.requestInquiriesLoading ||
            this.props.masterCardActionsLoading;

        if (this.props.payments.length <= 0) {
            return null;
        }

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 10,
                    ...this.props.wrapperStyle
                }}
            >
                {loadingState ? (
                    <CircularProgress style={this.props.loaderStyle} />
                ) : (
                    <Button
                        variant="raised"
                        color="primary"
                        aria-label="Load more items"
                        style={this.props.buttonStyle}
                        onClick={this.update}
                        disabled={loadingState}
                    >
                        {this.props.buttonContent ? (
                            this.props.buttonContent
                        ) : (
                            <RefreshIcon />
                        )}
                    </Button>
                )}
            </div>
        );
    }
}

LoadOlderButton.defaultProps = {
    updateExternal: false,
    buttonContent: false,
    wrapperStyle: {},
    loaderStyle: {},
    buttonStyle: {}
};

const mapStateToProps = state => {
    return {
        user: state.user.user,

        accountsAccountId: state.accounts.selectedAccount,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading,
        paymentsOlderId: state.payments.older_id,

        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        bunqMeTabsOlderId: state.bunq_me_tabs.older_id,

        requestResponsesLoading: state.request_responses.loading,
        requestResponsesOlderId: state.request_responses.older_id,

        requestInquiriesLoading: state.request_inquiries.loading,
        requestInquiriesOlderId: state.request_inquiries.older_id,

        masterCardActionsLoading: state.master_card_actions.loading,
        masterCardActionsOlderId: state.master_card_actions.older_id
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        paymentsUpdate: (userId, accountId, older_id) =>
            dispatch(
                paymentInfoUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id,
                    count: 50
                })
            ),
        requestInquiriesUpdate: (userId, accountId, older_id) =>
            dispatch(
                requestInquiriesUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id,
                    count: 50
                })
            ),
        requestResponsesUpdate: (userId, accountId, older_id) =>
            dispatch(
                requestResponsesUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id,
                    count: 50
                })
            ),
        masterCardActionsUpdate: (userId, accountId, older_id) =>
            dispatch(
                masterCardActionsUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id,
                    count: 50
                })
            ),
        bunqMeTabsUpdate: (userId, accountId, older_id) =>
            dispatch(
                bunqMeTabsUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id,
                    count: 50
                })
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadOlderButton);

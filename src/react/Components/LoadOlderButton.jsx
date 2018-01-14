import React from "react";
import {connect} from "react-redux";
import Button from "material-ui/Button";
import RefreshIcon from "material-ui-icons/Refresh";

import {paymentInfoUpdate} from "../Actions/payments";
import {requestResponsesUpdate} from "../Actions/request_responses";
import {bunqMeTabsUpdate} from "../Actions/bunq_me_tabs";
import {masterCardActionsUpdate} from "../Actions/master_card_actions";
import {requestInquiriesUpdate} from "../Actions/request_inquiries";

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
            this.props.bunqMeTabsUpdate(user.id, accountsAccountId);
            this.props.requestResponsesUpdate(user.id, accountsAccountId);
            this.props.requestInquiriesUpdate(user.id, accountsAccountId);
            this.props.masterCardActionsUpdate(user.id, accountsAccountId);
        }
    };

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 10
                }}
            >
                <Button
                    fab
                    color="primary"
                    aria-label="add"
                    onClick={this.update}
                >
                    <RefreshIcon/>
                </Button>
            </div>
        );
    }
}

LoadOlderButton.defaultProps = {
    updateExternal: false
};

const mapStateToProps = state => {
    return {
        user: state.user.user,

        accountsAccountId: state.accounts.selectedAccount,

        paymentsLoading: state.payments.loading,
        paymentsOlderId: state.payments.older_id
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const {BunqJSClient} = ownProps;
    return {
        paymentsUpdate: (userId, accountId, older_id) =>
            dispatch(
                paymentInfoUpdate(BunqJSClient, userId, accountId, {
                    older_id: older_id
                })
            ),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadOlderButton);

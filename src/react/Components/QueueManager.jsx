import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import { openSnackbar } from "../Actions/snackbar";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { paymentInfoUpdate } from "../Actions/payments";
import { shareInviteBankInquiriesInfoUpdate } from "../Actions/share_invite_bank_inquiries";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";

class QueueManager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            finishedSync: false
        };
    }

    componentDidUpdate() {
        const { accounts, accountsLoading, user, userLoading } = this.props;

        if (!this.state.finishedSync) {
            if (
                user &&
                !userLoading &&
                accounts &&
                !accountsLoading &&
                accounts.length > 0
            ) {
                console.log("Started sync");

                const userId = user.id;
                this.setState({
                    finishedSync: true
                });

                accounts.forEach(account => {
                    const accountId = account.id;

                    // this.props.paymentsUpdate(userId, accountId);
                    // this.props.bunqMeTabsUpdate(userId, accountId);
                    // this.props.requestResponsesUpdate(userId, accountId);
                    // this.props.requestInquiriesUpdate(userId, accountId);
                    // this.props.masterCardActionsUpdate(userId, accountId);
                    //
                    // if (!this.props.limitedPermissions) {
                    //     this.props.shareInviteBankInquiriesInfoUpdate(
                    //         userId,
                    //         accountId
                    //     );
                    // }
                });
            }
        }
    }

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
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId)),
        shareInviteBankInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(
                shareInviteBankInquiriesInfoUpdate(
                    BunqJSClient,
                    userId,
                    accountId
                )
            ),

        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(QueueManager));

import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import MoneyIcon from "@material-ui/icons/AttachMoney";

import { requestInquirySend } from "../../Actions/request_inquiry";

class AddMoneyButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    addMoney = event => {
        if (!this.props.requestInquiryLoading) {
            const requestInquiry = {
                amount_inquired: {
                    value: "500",
                    currency: "EUR"
                },
                counterparty_alias: {
                    type: "EMAIL",
                    value: "sugardaddy@bunq.com"
                },
                description: "Please daddy??",
                allow_bunqme: true
            };
            this.props.requestInquirySend(this.props.user.id, this.props.selectedAccount, [requestInquiry]);
        }
    };

    render() {
        const { environment, limitedPermissions, requestInquiryLoading } = this.props;

        if (environment !== "SANDBOX") return null;

        const contents = !limitedPermissions ? (
            <div
                style={{
                    textAlign: "center",
                    padding: 16
                }}
            >
                <Button variant="outlined" onClick={this.addMoney} disabled={requestInquiryLoading}>
                    <MoneyIcon />
                </Button>
            </div>
        ) : (
            <Typography variant="body1" style={{ margin: 8 }}>
                Logged in as OAuth sandbox user. Requesting money isn't possible.
            </Typography>
        );

        return <div style={{ minHeight: 74 }}>{contents}</div>;
    }
}

const mapStateToProps = state => {
    return {
        requestInquiryLoading: state.request_inquiry.loading,

        limitedPermissions: state.user.limited_permissions,

        selectedAccount: state.accounts.selected_account,

        environment: state.registration.environment
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        requestInquirySend: (userId, accountId, requestInquiries) =>
            dispatch(requestInquirySend(BunqJSClient, userId, accountId, requestInquiries))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AddMoneyButton));

import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

import { formatMoney } from "../../Functions/Utils";

import { shareInviteMonetaryAccountInquiryChangeStatus } from "../../Actions/share_invite_monetary_account_inquiry";
import { shareInviteMonetaryAccountResponseChangeStatus } from "../../Actions/share_invite_monetary_account_response";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class ConnectListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    toggleOpen = event => this.setState({ open: !this.state.open });

    revokeConnect = e => {
        const { user, type, connectInfo } = this.props;
        if (type === "ShareInviteMonetaryAccountInquiry") {
            this.props.shareInviteMonetaryAccountInquiryChangeStatus(
                user.id,
                connectInfo.monetary_account_id,
                connectInfo.id,
                "REVOKED"
            );
        } else {
            this.props.shareInviteMonetaryAccountResponseChangeStatus(user.id, connectInfo.id, "REVOKED");
        }
    };
    cancelConnect = e => {
        const { user, type, connectInfo } = this.props;
        if (type === "ShareInviteMonetaryAccountInquiry") {
            this.props.shareInviteMonetaryAccountInquiryChangeStatus(
                user.id,
                connectInfo.monetary_account_id,
                connectInfo.id,
                "CANCELLED"
            );
        } else {
            this.props.shareInviteMonetaryAccountResponseChangeStatus(user.id, connectInfo.id, "CANCELLED");
        }
    };

    render() {
        const { t, BunqJSClient, connectInfo } = this.props;

        const yesText = t("Yes");
        const noText = t("No");
        const acceptedText = t("Accepted");
        const pendingText = t("Pending");

        const budgetText = t("Budget");
        const paymentsText = t("Payments");
        const availableText = t("Available");
        const makeDraftText = t("Make draft payments");
        const viewBalanceText = t("View balance");
        const viewNewEventsText = t("View new events");
        const viewOldEventsText = t("View old events");

        // changes depending on response/inquiry
        const counterAliasInfo = connectInfo.counter_alias ? connectInfo.counter_alias : connectInfo.counter_user_alias;

        const imageUUID = counterAliasInfo.avatar.image[0].attachment_public_uuid;

        let cancelButton = (
            <div style={{ padding: 8 }}>
                <Button
                    color="secondary"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onClick={connectInfo.status === "ACCEPTED" ? this.cancelConnect : this.revokeConnect}
                >
                    Cancel connect
                </Button>
            </div>
        );

        let detailItem = null;
        if (connectInfo.share_detail.ShareDetailPayment) {
            const shareDetails = connectInfo.share_detail.ShareDetailPayment;

            detailItem = (
                <Collapse in={this.state.open}>
                    {shareDetails.budget ? (
                        <ListItem>
                            <ListItemText
                                primary={`${budgetText}: ${formatMoney(shareDetails.budget.amount.value)}`}
                                secondary={`${availableText}: ${formatMoney(
                                    shareDetails.budget.amount_available.value
                                )}`}
                            />
                        </ListItem>
                    ) : null}
                    <ListItem>
                        <ListItemText primary={`${paymentsText}: ${shareDetails.make_payments ? yesText : noText}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`${viewBalanceText}: ${shareDetails.view_balance ? yesText : noText}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${viewNewEventsText}: ${shareDetails.view_new_events ? yesText : noText}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${viewOldEventsText}: ${shareDetails.view_old_events ? yesText : noText}`}
                        />
                    </ListItem>
                    {cancelButton}
                </Collapse>
            );
        } else if (connectInfo.share_detail.ShareDetailReadOnly) {
            const shareDetails = connectInfo.share_detail.ShareDetailReadOnly;

            detailItem = (
                <Collapse in={this.state.open}>
                    <ListItem>
                        <ListItemText primary={`${paymentsText}: ${shareDetails.make_payments ? yesText : noText}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`${viewBalanceText}: ${shareDetails.view_balance ? yesText : noText}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${viewNewEventsText}: ${shareDetails.view_new_events ? yesText : noText}`}
                        />
                    </ListItem>
                    {cancelButton}
                </Collapse>
            );
        } else if (connectInfo.share_detail.ShareDetailDraftPayment) {
            const shareDetails = connectInfo.share_detail.ShareDetailDraftPayment;
            detailItem = (
                <Collapse in={this.state.open}>
                    <ListItem>
                        <ListItemText
                            primary={`${makeDraftText}: ${shareDetails.make_draft_payments ? yesText : noText}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`${viewBalanceText}: ${shareDetails.view_balance ? yesText : noText}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${viewNewEventsText}: ${shareDetails.view_new_events ? yesText : noText}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${viewOldEventsText}: ${shareDetails.view_old_events ? yesText : noText}`}
                        />
                    </ListItem>
                    {cancelButton}
                </Collapse>
            );
        } else {
            return null;
        }

        return (
            <React.Fragment>
                <ListItem button onClick={this.toggleOpen}>
                    <Avatar style={styles.smallAvatar}>
                        <LazyAttachmentImage height={50} BunqJSClient={BunqJSClient} imageUUID={imageUUID} />
                    </Avatar>
                    <ListItemText
                        primary={counterAliasInfo.display_name}
                        secondary={connectInfo.status === "ACCEPTED" ? acceptedText : pendingText}
                    />
                </ListItem>
                {detailItem}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        shareInviteMonetaryAccountInquiryChangeStatus: (
            userId,
            accountId,
            shareInviteMonetaryAccountInquiryId,
            status
        ) =>
            dispatch(
                shareInviteMonetaryAccountInquiryChangeStatus(
                    BunqJSClient,
                    userId,
                    accountId,
                    shareInviteMonetaryAccountInquiryId,
                    status
                )
            ),
        shareInviteMonetaryAccountResponseChangeStatus: (userId, shareInviteMonetaryAccountResponseId, status) =>
            dispatch(
                shareInviteMonetaryAccountResponseChangeStatus(
                    BunqJSClient,
                    userId,
                    shareInviteMonetaryAccountResponseId,
                    status
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectListItem);

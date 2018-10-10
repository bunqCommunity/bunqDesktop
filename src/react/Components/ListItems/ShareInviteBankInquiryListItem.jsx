import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import TranslateButton from "../TranslationHelpers/Button";

import ShowOnly from "./ShareInviteBankTypes/ShowOnly";
import FullAccess from "./ShareInviteBankTypes/FullAccess";
import DraftAccess from "./ShareInviteBankTypes/DraftAccess";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiries";

const styles = {
    listItemText: {
        marginRight: 40
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    buttons: {
        marginRight: 8
    }
};

class ShareInviteBankInquiryListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    cancel = event => {
        const { t, BunqJSClient, user, shareInviteBankInquiry } = this.props;

        const success = t("The share request was successfully revoked");
        const failed = t("Failed to revoke the share request");

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteBankInquiry
                .putStatus(user.id, shareInviteBankInquiry.monetary_account_id, shareInviteBankInquiry.id, "REVOKED")
                .then(response => {
                    // trigger an update
                    this.props.shareInviteBankInquiriesInfoUpdate(user.id, shareInviteBankInquiry.monetary_account_id);

                    this.setState({ loading: false });
                    this.props.openSnackbar(success);
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.props.openSnackbar(failed);
                });
        }
    };

    render() {
        const { t, shareInviteBankInquiry } = this.props;
        if (!shareInviteBankInquiry) return null;

        let aliasInfo = shareInviteBankInquiry.counter_user_alias
            ? shareInviteBankInquiry.counter_user_alias
            : shareInviteBankInquiry.counter_alias;
        if (!aliasInfo) return null;

        let imageUUID = false;
        if (aliasInfo.avatar) {
            imageUUID = aliasInfo.avatar.image[0].attachment_public_uuid;
        }
        const displayName = aliasInfo.display_name;

        const connectActions = (
            <React.Fragment>
                <TranslateButton
                    style={styles.buttons}
                    variant="contained"
                    color="secondary"
                    onClick={this.cancel}
                    disabled={this.state.loading}
                >
                    Cancel
                </TranslateButton>
            </React.Fragment>
        );

        const shareDetailTypes = Object.keys(shareInviteBankInquiry.share_detail);
        const shareDetailType = shareDetailTypes[0];

        let shareTypeObject = null;
        switch (shareDetailType) {
            case "ShareDetailPayment":
                shareTypeObject = <FullAccess t={t} secondaryActions={connectActions} />;
                break;
            case "ShareDetailDraftPayment":
                shareTypeObject = <DraftAccess t={t} secondaryActions={connectActions} />;
                break;
            case "ShareDetailReadOnly":
                shareTypeObject = <ShowOnly t={t} secondaryActions={connectActions} />;
                break;
        }

        return [
            <ListItem button onClick={e => this.setState({ open: !this.state.open })}>
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage height={50} BunqJSClient={this.props.BunqJSClient} imageUUID={imageUUID} />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={t("Connect invite sent")} />
                <ListItemSecondaryAction />
            </ListItem>,
            <Collapse in={this.state.open} unmountOnExit>
                {shareTypeObject}
            </Collapse>,
            <Divider />
        ];
    }
}

ShareInviteBankInquiryListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsSelectedId: state.accounts.selected_account
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        shareInviteBankInquiriesInfoUpdate: userId => dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(ShareInviteBankInquiryListItem));

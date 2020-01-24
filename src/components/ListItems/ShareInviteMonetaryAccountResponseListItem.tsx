import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import { AppWindow } from "~app";
import { AppDispatch, ReduxState } from "~store/index";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import TranslateButton from "../TranslationHelpers/Button";

import ShowOnly from "./ShareInviteBankTypes/ShowOnly";
import FullAccess from "./ShareInviteBankTypes/FullAccess";
import DraftAccess from "./ShareInviteBankTypes/DraftAccess";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "~actions/share_invite_monetary_account_responses";

declare let window: AppWindow;

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

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class ShareInviteMonetaryAccountResponseListItem extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        displayAcceptedRequests: true,
        minimalDisplay: false
    };

    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    accept = event => {
        const { t, user, shareInviteMonetaryAccountResponse } = this.props;

        const success = t("The share request was successfully accepted");
        const failed = t("Failed to accept the share request");
        const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteMonetaryAccountResponse
                .put(user.id, shareInviteMonetaryAccountResponse.id, "ACCEPTED")
                .then(response => {
                    // trigger an update
                    this.props.shareInviteMonetaryAccountResponsesInfoUpdate(user.id);

                    this.setState({ loading: false });
                    this.props.openSnackbar(success);
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.props.openSnackbar(failed);
                });
        }
    };

    reject = event => {
        const { t, user, shareInviteMonetaryAccountResponse } = this.props;

        const success = t("The share request was successfully cancelled");
        const failed = t("Failed to reject the share request");
        const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteMonetaryAccountResponse
                .put(user.id, shareInviteMonetaryAccountResponse.id, "CANCELLED")
                .then(response => {
                    // trigger an update
                    this.props.shareInviteMonetaryAccountResponsesInfoUpdate(user.id);

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
        const { t, shareInviteMonetaryAccountResponse } = this.props;
        if (!shareInviteMonetaryAccountResponse) return null;

        let aliasInfo = shareInviteMonetaryAccountResponse.counter_alias;
        if (!aliasInfo) return null;

        let imageUUID = false;
        if (aliasInfo.avatar) {
            imageUUID = aliasInfo.avatar.image[0].attachment_public_uuid;
        }
        const displayName = aliasInfo.display_name;

        const connectActions = (
            <>
                <TranslateButton
                    style={styles.buttons}
                    variant="contained"
                    color="primary"
                    onClick={this.accept}
                    disabled={this.state.loading}
                >
                    Accept
                </TranslateButton>
                <TranslateButton
                    style={styles.buttons}
                    variant="contained"
                    color="secondary"
                    onClick={this.reject}
                    disabled={this.state.loading}
                >
                    Reject
                </TranslateButton>
            </>
        );

        const shareDetailTypes = Object.keys(shareInviteMonetaryAccountResponse.share_detail);
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
                    <LazyAttachmentImage height={50} imageUUID={imageUUID} />
                </Avatar>
                <ListItemText
                    style={styles.listItemText}
                    primary={displayName}
                    secondary={t("Connect invite received")}
                />
                <ListItemSecondaryAction />
            </ListItem>,
            <Collapse in={this.state.open} unmountOnExit>
                {shareTypeObject}
            </Collapse>,
            <Divider />
        ];
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user.user,
        accountsSelectedId: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        shareInviteMonetaryAccountResponsesInfoUpdate: userId =>
            dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(userId))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(ShareInviteMonetaryAccountResponseListItem));

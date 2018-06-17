import React from "react";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import VpnKeyIcon from "@material-ui/icons/VpnKey";
import GroupIcon from "@material-ui/icons/Group";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import TranslateButton from "../TranslationHelpers/Button";

import ShowOnly from "./ShareInviteBankTypes/ShowOnly";
import FullAccess from "./ShareInviteBankTypes/FullAccess";
import ParentChild from "./ShareInviteBankTypes/ParentChild";

const styles = {
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
            id: null,
            open: false
        };
    }

    render() {
        const { t, shareInviteBankInquiry } = this.props;

        let imageUUID = false;
        if (shareInviteBankInquiry.counter_alias.avatar) {
            imageUUID =
                shareInviteBankInquiry.counter_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName =
            shareInviteBankInquiry.counter_alias.display_name;

        const connectActions = (
            <React.Fragment>
                <TranslateButton
                    style={styles.buttons}
                    variant="raised"
                    color="secondary"
                >
                    Cancel
                </TranslateButton>
            </React.Fragment>
        );

        return [
            <ListItem
                button
                onClick={e => this.setState({ open: !this.state.open })}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText
                    primary={displayName}
                    secondary={t("Connect invite sent")}
                />
                <ListItemSecondaryAction />
            </ListItem>,
            <Collapse in={this.state.open} unmountOnExit>
                <FullAccess t={t} secondaryActions={connectActions} />
                <ParentChild t={t} secondaryActions={connectActions} />
                <ShowOnly t={t} secondaryActions={connectActions} />
            </Collapse>,
            <Divider />
        ];
    }
}

ShareInviteBankInquiryListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

export default translate("translations")(ShareInviteBankInquiryListItem);

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import { formatMoney } from "../../Helpers/Utils";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

export default class ConnectListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    toggleOpen = event => this.setState({ open: !this.state.open });

    render() {
        const { t, BunqJSClient, connectInfo } = this.props;

        const yesText = t("Yes");
        const noText = t("No");

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
                </Collapse>
            );
        } else if (connectInfo.share_detail.ShareDetailDraftPayment) {
            const shareDetails = connectInfo.share_detail.ShareDetailDraftPayment;
            detailItem = (
                <Collapse in={this.state.open}>
                    <ListItem>
                        <ListItemText primary={`${makeDraftText}: ${shareDetails.make_payments ? yesText : noText}`} />
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
                    <ListItemText primary={counterAliasInfo.display_name} />
                </ListItem>
                {detailItem}
            </React.Fragment>
        );
    }
}

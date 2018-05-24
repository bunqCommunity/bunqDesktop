import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
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
        const { BunqJSClient, connectInfo } = this.props;

        // changes depending on response/inquiry
        const counterAliasInfo = connectInfo.counter_alias
            ? connectInfo.counter_alias
            : connectInfo.counter_user_alias;

        const imageUUID =
            counterAliasInfo.avatar.image[0].attachment_public_uuid;

        const shareDetails = connectInfo.share_detail.ShareDetailPayment;

        return (
            <React.Fragment>
                <ListItem button onClick={this.toggleOpen}>
                    <Avatar style={styles.smallAvatar}>
                        <LazyAttachmentImage
                            width={50}
                            BunqJSClient={BunqJSClient}
                            imageUUID={imageUUID}
                        />
                    </Avatar>
                    <ListItemText primary={counterAliasInfo.display_name} />
                </ListItem>
                <Collapse in={this.state.open}>
                    {shareDetails.budget ? (
                        <ListItem>
                            <ListItemText
                                primary={`Budget: ${formatMoney(
                                    shareDetails.budget.amount.value
                                )}`}
                                secondary={`Available: ${formatMoney(
                                    shareDetails.budget.amount_available.value
                                )}`}
                            />
                        </ListItem>
                    ) : null}
                    <ListItem>
                        <ListItemText
                            primary={`Payments: ${shareDetails.make_payments
                                ? "Yes"
                                : "No"}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`View balance: ${shareDetails.view_balance
                                ? "Yes"
                                : "No"}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`View new events: ${shareDetails.view_new_events
                                ? "Yes"
                                : "No"}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`View old events: ${shareDetails.view_old_events
                                ? "Yes"
                                : "No"}`}
                        />
                    </ListItem>
                </Collapse>
            </React.Fragment>
        );
    }
}

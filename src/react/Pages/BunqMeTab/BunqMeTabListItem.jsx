import React from "react";
import { withTheme } from "material-ui/styles";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import { formatMoney, humanReadableDate } from "../../Helpers/Utils";
import NavLink from "../../Components/Routing/NavLink";
import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class BunqMeTabListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.bunqMeTab.id !== this.props.bunqMeTab.id;
    }

    render() {
        const { bunqMeTab, theme } = this.props;

        return <ListItem>tab</ListItem>

        let imageUUID = false;
        if (bunqMeTab.counterparty_alias.avatar) {
            imageUUID =
                payment.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = bunqMeTab.counterparty_alias.display_name;
        const paymentDate = new Date(bunqMeTab.created).toLocaleString();
        const paymentAmount = bunqMeTab.amount.value;
        const formattedPaymentAmount = formatMoney(bunqMeTab.amount.value);
        const paymentColor =
            paymentAmount < 0
                ? theme.palette.common.sentPayment
                : theme.palette.common.receivedPayment;

        return [
            <ListItem
                button
                to={`/payment/${bunqMeTab.id}/${bunqMeTab.monetary_account_id}`}
                component={NavLink}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText primary={displayName} secondary={paymentDate} />
                <ListItemSecondaryAction>
                    <p
                        style={{
                            marginRight: 20,
                            color: paymentColor
                        }}
                    >
                        {formattedPaymentAmount}
                    </p>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default withTheme()(BunqMeTabListItem);

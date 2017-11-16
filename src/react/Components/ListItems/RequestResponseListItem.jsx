import React from "react";
import { withTheme } from "material-ui/styles";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import { formatMoney } from "../../Helpers/Utils";
import NavLink from "../../Components/Routing/NavLink";
import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class RequestResponseListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.requestResponse.id !== this.props.requestResponse.id;
    }

    render() {
        const { requestResponse, theme } = this.props;

        let imageUUID = false;
        if (requestResponse.counterparty_alias.avatar) {
            imageUUID =
                requestResponse.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = requestResponse.counterparty_alias.display_name;
        const paymentAmount = requestResponse.amount_inquired.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);

        let paymentLabel;
        const requestResponseMoneyStyle = {
            marginRight: 20
        };
        switch (requestResponse.status) {
            case "ACCEPTED":
                paymentLabel = "Request paid";
                requestResponseMoneyStyle.color =
                    theme.palette.requestResponse.accepted;
                break;
            case "PENDING":
                paymentLabel = "Request received";
                requestResponseMoneyStyle.color =
                    theme.palette.requestResponse.pending;
                requestResponseMoneyStyle.opacity = 0.7;
                break;
            case "REJECTED":
                paymentLabel = "Request denied";
                requestResponseMoneyStyle.color =
                    theme.palette.requestResponse.rejected;
                requestResponseMoneyStyle.textDecoration = "line-through";
                break;
            case "REVOKED":
                paymentLabel = "Request cancelled";
                requestResponseMoneyStyle.color =
                    theme.palette.requestResponse.revoked;
                break;
        }

        return [
            <ListItem
                button
                component={NavLink}
                to={`/request-response-info/${requestResponse.id}/${requestResponse.monetary_account_id}`}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText primary={displayName} secondary={paymentLabel} />
                <ListItemSecondaryAction>
                    <p style={requestResponseMoneyStyle}>
                        {formattedPaymentAmount}
                    </p>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default withTheme()(RequestResponseListItem);

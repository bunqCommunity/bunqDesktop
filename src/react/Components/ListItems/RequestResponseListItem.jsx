import React from "react";
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
import MoneyAmountLabel from "../MoneyAmountLabel";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20
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
        const { requestResponse } = this.props;

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
        switch (requestResponse.status) {
            case "ACCEPTED":
                paymentLabel = "You paid the request";
                break;
            case "PENDING":
                paymentLabel = "Received a request";
                break;
            case "REJECTED":
                paymentLabel = "You denied the request";
                break;
            case "REVOKED":
                paymentLabel = "Request was cancelled";
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
                    <MoneyAmountLabel
                        style={styles.moneyAmountLabel}
                        info={requestResponse}
                        type="requestResponse"
                    >
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default RequestResponseListItem;

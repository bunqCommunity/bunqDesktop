import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import { formatMoney } from "../../Helpers/Utils";
import { requestResponseText } from "../../Helpers/StatusTexts";
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
        if (requestResponse.status === "ACCEPTED") {
            if (this.props.displayAcceptedRequests === false) {
                // hide the request-response becuase a payment item exists
                return null;
            }
        }

        let imageUUID = false;
        if (requestResponse.counterparty_alias.avatar) {
            imageUUID =
                requestResponse.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = requestResponse.counterparty_alias.display_name;
        const paymentAmount = requestResponse.amount_inquired.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);
        let paymentLabel = requestResponseText(requestResponse);

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

RequestResponseListItem.defaultProps = {
    displayAcceptedRequests: true
};

export default RequestResponseListItem;

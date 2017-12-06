import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import { formatMoney } from "../../Helpers/Utils";
import { requestInquiryText } from "../../Helpers/StatusTexts";
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

class RequestInquiryListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.requestInquiry.id !== this.props.requestInquiry.id;
    }

    render() {
        const { requestInquiry } = this.props;
        if (requestInquiry.status === "ACCEPTED") {
            if (this.props.displayAcceptedRequests === false) {
                // hide the request-response becuase a payment item exists
                return null;
            }
        }

        let imageUUID = false;
        if (requestInquiry.counterparty_alias.avatar) {
            imageUUID =
                requestInquiry.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = requestInquiry.counterparty_alias.display_name;
        const paymentAmount = requestInquiry.amount_inquired.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);
        let paymentLabel = requestInquiryText(requestInquiry);

        return [
            <ListItem
                button
                component={NavLink}
                to={`/request-inquiry-info/${requestInquiry.id}/${requestInquiry.monetary_account_id}`}
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
                        info={requestInquiry}
                        type="requestInquiry"
                    >
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

RequestInquiryListItem.defaultProps = {
    displayAcceptedRequests: true
};

export default RequestInquiryListItem;

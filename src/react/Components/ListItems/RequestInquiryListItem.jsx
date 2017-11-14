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
        const { requestInquiry, theme } = this.props;

        let imageUUID = false;
        if (requestInquiry.counterparty_alias.avatar) {
            imageUUID =
                requestInquiry.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = requestInquiry.counterparty_alias.display_name;
        const paymentAmount = requestInquiry.amount_inquired.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);
        const paymentColor =
            paymentAmount < 0
                ? theme.palette.common.sentPayment
                : theme.palette.common.receivedPayment;

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
                <ListItemText
                    primary={displayName}
                    secondary={"Request pending"}
                />
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

export default withTheme()(RequestInquiryListItem);

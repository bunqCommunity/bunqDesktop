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
import Logger from "../../Helpers/Logger";
import NavLink from "../../Components/Routing/NavLink";
import AttachmentImage from "../../Components/AttachmentImage";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class PaymentListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.payment.id !== this.props.payment.id;
    }

    render() {
        const { payment, theme } = this.props;

        let imageUUID = false;
        if (payment.counterparty_alias.avatar) {
            imageUUID =
                payment.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = payment.counterparty_alias.display_name;
        const paymentDate = new Date(payment.created).toLocaleString();
        const paymentAmount = payment.amount.value;
        const formattedPaymentAmount = formatMoney(payment.amount.value);
        const paymentColor =
            paymentAmount < 0
                ? theme.palette.common.sentPayment
                : theme.palette.common.receivedPayment;

        return [
            <ListItem button to={`/payment/${payment.id}`} component={NavLink}>
                <Avatar style={styles.smallAvatar}>
                    <AttachmentImage
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

export default withTheme()(PaymentListItem);

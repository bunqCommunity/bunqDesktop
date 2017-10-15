import React from "react";
import { withTheme } from "material-ui/styles";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import NavLink from "../Components/Sub/NavLink";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class PaymentListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { payment, theme } = this.props;

        let icon_uri =
            "https://static.useresponse.com/public/bunq/avatars/default-avatar.svg";
        let avatar = payment.counterparty_alias.avatar;
        if (avatar) {
            icon_uri = `/api/attachment/${avatar.image[0]
                .attachment_public_uuid}`;
        }
        const displayName = payment.counterparty_alias.display_name;
        const paymentDate = new Date(payment.created).toLocaleString();
        const paymentAmount = payment.amount.value;
        const paymentColor =
            paymentAmount < 0
                ? theme.palette.common.sentPayment
                : theme.palette.common.receivedPayment;

        return [
            <ListItem button to={`/payment/${payment.id}`} component={NavLink}>
                <Avatar style={styles.smallAvatar}>
                    <img width={50} src={icon_uri} />
                </Avatar>
                <ListItemText primary={displayName} secondary={paymentDate} />
                <ListItemSecondaryAction>
                    <p
                        style={{
                            marginRight: 20,
                            color: paymentColor
                        }}
                    >
                        € {paymentAmount}
                    </p>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default withTheme(PaymentListItem);

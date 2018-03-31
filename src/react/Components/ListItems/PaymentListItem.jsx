import React from "react";
import { translate } from "react-i18next";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import { formatMoney } from "../../Helpers/Utils";
import { paymentText } from "../../Helpers/StatusTexts";
import NavLink from "../Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import MoneyAmountLabel from "../MoneyAmountLabel";
import CategoryIcons from "../Categories/CategoryIcons";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20
    }
};

class PaymentListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    // shouldComponentUpdate(nextProps) {
    //     return nextProps.payment.id !== this.props.payment.id;
    // }

    render() {
        const { payment } = this.props;

        let imageUUID = false;
        if (payment.counterparty_alias.avatar) {
            imageUUID =
                payment.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = payment.counterparty_alias.display_name;
        const paymentAmount = payment.amount.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);
        const paymentTypeLabel = paymentText(payment, this.props.t);

        return [
            <ListItem
                button
                to={`/payment/${payment.id}/${payment.monetary_account_id}`}
                component={NavLink}
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
                    secondary={paymentTypeLabel}
                />
                <ListItemSecondaryAction style={{ marginTop: -16 }}>
                    <MoneyAmountLabel
                        style={styles.moneyAmountLabel}
                        info={payment}
                        type="payment"
                    >
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
                <CategoryIcons
                    style={{ marginTop: 26 }}
                    type={"Payment"}
                    id={payment.id}
                />
            </ListItem>,
            <Divider />
        ];
    }
}

PaymentListItem.defaultProps = {
    minimalDisplay: false
};

export default translate("translations")(PaymentListItem);

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { translate } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "../../Helpers/Utils";
import { requestInquiryText } from "../../Helpers/StatusTexts";
import NavLink from "../../Components/Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import CategoryIcons from "../Categories/CategoryIcons";
import MoneyAmountLabel from "../MoneyAmountLabel";

const styles = {
    listItemText: {
        marginRight: 40
    },
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

    // shouldComponentUpdate(nextProps) {
    //     return nextProps.requestInquiry.id !== this.props.requestInquiry.id;
    // }

    render() {
        const { requestInquiry, t } = this.props;
        if (requestInquiry.status === "ACCEPTED") {
            if (this.props.displayAcceptedRequests === false) {
                // hide the request-response because a payment item exists
                return null;
            }
        }

        let imageUUID = false;
        if (requestInquiry.counterparty_alias.avatar) {
            imageUUID = requestInquiry.counterparty_alias.avatar.image[0].attachment_public_uuid;
        }
        const displayName = requestInquiry.counterparty_alias.display_name;
        const paymentAmount = requestInquiry.getAmount();
        const formattedPaymentAmount = formatMoney(paymentAmount);
        let paymentLabel = requestInquiryText(requestInquiry, t);

        return [
            <ListItem
                button
                component={NavLink}
                to={`/request-inquiry-info/${requestInquiry.id}/${requestInquiry.monetary_account_id}`}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage height={50} BunqJSClient={this.props.BunqJSClient} imageUUID={imageUUID} />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={paymentLabel} />
                <ListItemSecondaryAction style={{ marginTop: -16 }}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={requestInquiry} type="requestInquiry">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
                <CategoryIcons style={{ marginTop: 26 }} type={"RequestInquiry"} id={requestInquiry.id} />
            </ListItem>,
            <Divider />
        ];
    }
}

RequestInquiryListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

export default translate("translations")(RequestInquiryListItem);

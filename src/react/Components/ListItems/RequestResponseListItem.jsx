import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { translate } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "../../Helpers/Utils";
import { requestResponseText } from "../../Helpers/StatusTexts";
import { defaultRequestResponseImage } from "../../Helpers/DefaultImageHandlers";

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

class RequestResponseListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    // shouldComponentUpdate(nextProps) {
    //     return nextProps.requestResponse.id !== this.props.requestResponse.id;
    // }

    render() {
        const { requestResponse, t } = this.props;
        if (requestResponse.status === "ACCEPTED") {
            if (this.props.displayAcceptedRequests === false) {
                // hide the request-response because a payment item exists
                return null;
            }
        }

        let imageUUID = false;
        if (requestResponse.counterparty_alias.avatar) {
            imageUUID = requestResponse.counterparty_alias.avatar.image[0].attachment_public_uuid;
        }
        const displayName = requestResponse.counterparty_alias.display_name;
        let paymentAmount = requestResponse.getAmount();
        paymentAmount = paymentAmount > 0 ? paymentAmount * -1 : paymentAmount;
        const formattedPaymentAmount = formatMoney(paymentAmount, true);
        let paymentLabel = requestResponseText(requestResponse, t);

        let defaultImage = defaultRequestResponseImage(requestResponse);

        return [
            <ListItem
                button
                component={NavLink}
                to={`/request-response-info/${requestResponse.id}/${requestResponse.monetary_account_id}`}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        height={50}
                        defaultImage={defaultImage}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={paymentLabel} />
                <ListItemSecondaryAction style={{ marginTop: -16 }}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={requestResponse} type="requestResponse">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
                <CategoryIcons style={{ marginTop: 26 }} type={"RequestResponse"} id={requestResponse.id} />
            </ListItem>,
            <Divider />
        ];
    }
}

RequestResponseListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

export default translate("translations")(RequestResponseListItem);

import React from "react";
import OrigListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { translate } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "~functions/Utils";
import { requestResponseText } from "~functions/EventStatusTexts";
import { defaultRequestResponseImage } from "~functions/DefaultImageHandlers";

import NavLink from "~components/Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import CategoryIcons from "../Categories/CategoryIcons";
import MoneyAmountLabel from "../MoneyAmountLabel";

const ListItem: any = OrigListItem;

const styles = {
    listItemText: {
        marginRight: 40
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 8,
        textAlign: "right"
    },
    listItemSecondary: {
        marginTop: -8
    },
    categoryIcons: {
        marginTop: 12
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class RequestResponseListItem extends React.Component<IProps> {
    static defaultProps = {
        displayAcceptedRequests: true,
        minimalDisplay: false
    };

    state: IState;

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
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={paymentLabel} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={requestResponse} type="requestResponse">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                    <CategoryIcons style={styles.categoryIcons} type={"RequestResponse"} id={requestResponse.id} />
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default translate("translations")(RequestResponseListItem);

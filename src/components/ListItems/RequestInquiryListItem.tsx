import React from "react";
import OrigListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { translate } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "~functions/Utils";
import { requestInquiryText } from "~functions/EventStatusTexts";
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

class RequestInquiryListItem extends React.Component<IProps> {
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
                    <LazyAttachmentImage height={50} imageUUID={imageUUID} />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={paymentLabel} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={requestInquiry} type="requestInquiry">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                    <CategoryIcons style={styles.categoryIcons} type={"RequestInquiry"} id={requestInquiry.id} />
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default translate("translations")(RequestInquiryListItem);

import React from "react";
import { translate } from "react-i18next";
import { withTheme } from "material-ui/styles";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";

import NavLink from "../../Components/Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import CategoryIcons from "../Categories/CategoryIcons";
import MoneyAmountLabel from "../MoneyAmountLabel";

import { masterCardActionParser } from "../../Helpers/StatusTexts";
import { formatMoney } from "../../Helpers/Utils";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20
    }
};

class MasterCardActionListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    // shouldComponentUpdate(nextProps) {
    //     return nextProps.masterCardAction.id !== this.props.masterCardAction.id;
    // }

    render() {
        const { masterCardAction, t } = this.props;

        let imageUUID = false;
        if (masterCardAction.counterparty_alias.avatar) {
            imageUUID =
                masterCardAction.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = masterCardAction.counterparty_alias.display_name;
        const paymentAmount = masterCardAction.amount_billing.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);
        const secondaryText = masterCardActionParser(masterCardAction, t);

        return [
            <ListItem
                button
                component={NavLink}
                to={`/mastercard-action-info/${masterCardAction.id}/${masterCardAction.monetary_account_id}`}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText primary={displayName} secondary={secondaryText} />
                <ListItemSecondaryAction style={{ marginTop: -16 }}>
                    <MoneyAmountLabel
                        style={styles.moneyAmountLabel}
                        info={masterCardAction}
                        type="masterCardAction"
                    >
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
                <CategoryIcons
                    style={{ marginTop: 26 }}
                    type={"MasterCardAction"}
                    id={masterCardAction.id}
                />
            </ListItem>,

            <Divider />
        ];
    }
}

MasterCardActionListItem.defaultProps = {
    minimalDisplay: false
};

export default withTheme()(translate("translations")(MasterCardActionListItem));

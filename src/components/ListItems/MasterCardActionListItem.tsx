import React from "react";
import { translate } from "react-i18next";
import { withTheme } from "@material-ui/core/styles";
import OriginalListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import NavLink from "~components/Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import CategoryIcons from "../Categories/CategoryIcons";
import MoneyAmountLabel from "../MoneyAmountLabel";

import { masterCardActionParser } from "~functions/EventStatusTexts";
import { formatMoney } from "~functions/Utils";
import { defaultMastercardImage } from "~functions/DefaultImageHandlers";

const ListItem: any = OriginalListItem;

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

class MasterCardActionListItem extends React.Component<IProps> {
    static defaultProps = {
        minimalDisplay: false
    };

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
            imageUUID = masterCardAction.counterparty_alias.avatar.image[0].attachment_public_uuid;
        }
        const displayName = masterCardAction.counterparty_alias.display_name;
        let paymentAmount = masterCardAction.getAmount();
        paymentAmount = paymentAmount > 0 ? paymentAmount * -1 : paymentAmount;
        const formattedPaymentAmount = formatMoney(paymentAmount, true);
        const secondaryText = masterCardActionParser(masterCardAction, t);

        const defaultImage = defaultMastercardImage(masterCardAction);

        return [
            <ListItem
                button
                component={NavLink}
                to={`/mastercard-action-info/${masterCardAction.id}/${masterCardAction.monetary_account_id}`}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        height={50}
                        defaultImage={defaultImage}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={displayName} secondary={secondaryText} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={masterCardAction} type="masterCardAction">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                    <CategoryIcons style={styles.categoryIcons} type={"MasterCardAction"} id={masterCardAction.id} />
                </ListItemSecondaryAction>
            </ListItem>,

            <Divider />
        ];
    }
}

export default withTheme()(translate("translations")(MasterCardActionListItem));

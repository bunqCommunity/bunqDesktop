import React from "react";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "../../Functions/Utils";
import { paymentText } from "../../Functions/EventStatusTexts";
import { defaultPaymentImage } from "../../Functions/DefaultImageHandlers";

import NavLink from "../Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import MoneyAmountLabel from "../MoneyAmountLabel";
import CategoryIcons from "../Categories/CategoryIcons";

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

class PaymentListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    render() {
        const { t, payment, accounts } = this.props;
        if (payment.sub_type === "REQUEST") {
            if (this.props.displayRequestPayments === false) {
                // hide the payments because a request response exists
                return null;
            }
        }

        let imageUUID = false;
        if (payment.counterparty_alias.avatar) {
            imageUUID = payment.counterparty_alias.avatar.image[0].attachment_public_uuid;
        }
        const displayName = payment.counterparty_alias.display_name;
        const paymentAmount = parseFloat(payment.amount.value);
        const formattedPaymentAmount = formatMoney(paymentAmount, true);
        const paymentTypeLabel = paymentText(payment, this.props.t);
        const counterPartyIban = payment.counterparty_alias.iban;

        let accountInfo = false;
        let counterpartyAccountInfo = false;
        if (counterPartyIban) {
            accounts.forEach(account => {
                // check alias values for this account
                const matchesCounterparty = account.alias.some(alias => {
                    if (alias.type === "IBAN") {
                        if (alias.value === counterPartyIban) {
                            return true;
                        }
                    }
                    return false;
                });
                if (matchesCounterparty) {
                    counterpartyAccountInfo = account;
                }

                if (account.id === payment.monetary_account_id) {
                    accountInfo = account;
                }
            });
        }

        let primaryText = displayName;
        let secondaryText = paymentTypeLabel;

        const fromText = t("from");
        const toText = t("to");

        // if transfer between personal accounts
        if (counterpartyAccountInfo) {
            primaryText = accountInfo.description;

            // on transfers we attempt to use our own alias instead
            if (payment.alias.avatar) {
                imageUUID = payment.alias.avatar.image[0].attachment_public_uuid;
            }

            // format secondary text
            const connectWord = paymentAmount < 0 ? fromText : toText;
            const connectWordSecondary = paymentAmount > 0 ? fromText : toText;
            secondaryText = `${t("Transferred")} ${connectWord} ${accountInfo.description} ${connectWordSecondary} ${
                counterpartyAccountInfo.description
            }`;
        }

        const defaultImage = defaultPaymentImage(payment);

        return [
            <ListItem button to={`/payment/${payment.id}/${payment.monetary_account_id}`} component={NavLink}>
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        height={50}
                        defaultImage={defaultImage}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={primaryText} secondary={secondaryText} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={payment} type="payment">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                    <CategoryIcons style={styles.categoryIcons} type={"Payment"} id={payment.id} />
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

PaymentListItem.defaultProps = {
    displayRequestPayments: true,
    minimalDisplay: false
};

export default translate("translations")(PaymentListItem);

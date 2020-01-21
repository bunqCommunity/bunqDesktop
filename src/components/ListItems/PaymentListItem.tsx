import React from "react";
import { translate } from "react-i18next";
import OrigListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { formatMoney } from "~functions/Utils";
import { paymentText } from "~functions/EventStatusTexts";
import { defaultPaymentImage } from "~functions/DefaultImageHandlers";

import NavLink from "../Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import MoneyAmountLabel from "../MoneyAmountLabel";
import CategoryIcons from "../Categories/CategoryIcons";

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

class PaymentListItem extends React.Component<IProps> {
    static defaultProps = {
        displayRequestPayments: true,
        minimalDisplay: false
    };

    state: IState;

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
            // @ts-ignore
            primaryText = accountInfo.description;

            // on transfers we attempt to use our own alias instead
            if (payment.alias.avatar) {
                imageUUID = payment.alias.avatar.image[0].attachment_public_uuid;
            }

            // format secondary text
            const connectWord = paymentAmount < 0 ? fromText : toText;
            const connectWordSecondary = paymentAmount > 0 ? fromText : toText;
            // @ts-ignore
            secondaryText = `${t("Transferred")} ${connectWord} ${accountInfo.description} ${connectWordSecondary} ${counterpartyAccountInfo.description}`;
        }

        const defaultImage = defaultPaymentImage(payment);

        return [
            <ListItem button to={`/payment/${payment.id}/${payment.monetary_account_id}`} component={NavLink as any}>
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        height={50}
                        defaultImage={defaultImage}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText style={styles.listItemText} primary={primaryText} secondary={secondaryText} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel as any} info={payment} type="payment">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                    <CategoryIcons style={styles.categoryIcons} type={"Payment"} id={payment.id} />
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default translate("translations")(PaymentListItem);

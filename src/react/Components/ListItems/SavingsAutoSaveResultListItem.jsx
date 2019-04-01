import React from "react";
import { translate } from "react-i18next";
import withTheme from "@material-ui/core/styles/withTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Icon from "@material-ui/core/Icon";

import ArrowDownwardIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpwardIcon from "@material-ui/icons/KeyboardArrowUp";

import PaymentListItem from "./PaymentListItem";
import MoneyAmountLabel from "../MoneyAmountLabel";
import BunqDesktopImage from "../AttachmentImage/BunqDesktopImage";

import { humanReadableDate, formatMoney } from "../../Functions/Utils";
import { savingsAutoSaveResultPrimaryText, eventGenericText } from "../../Functions/EventStatusTexts";

const styles = {
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
    }
};

const classStyles = theme => ({
    badge: {
        top: 4,
        right: 4,
        border: `2px solid ${theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[900]}`
    }
});

class SavingsAutoSaveResultListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            extraInfoOpen: false,
            paymentsOpen: false
        };
    }

    toggleExtraInfo = () => {
        this.setState({ extraInfoOpen: !this.state.extraInfoOpen });
    };

    togglePayments = () => {
        this.setState({ paymentsOpen: !this.state.paymentsOpen });
    };

    render() {
        const { savingsAutoSaveResult, accounts, theme, t } = this.props;

        const createdDate = humanReadableDate(savingsAutoSaveResult.created);
        const updatedDate = humanReadableDate(savingsAutoSaveResult.updated);
        const savingsAutoSaveEntries = savingsAutoSaveResult.savings_auto_save_entries;
        const numberOfPayments = savingsAutoSaveEntries.length;

        // calculate how much was paid to this inquiry
        const totalPaidAmount = savingsAutoSaveResult.getAmount();

        // format the amounts
        const formattedTotalPaid = formatMoney(totalPaidAmount);

        const avatarStandalone = (
            <Avatar style={styles.smallAvatar}>
                <BunqDesktopImage
                    config={savingsAutoSaveResult.image}
                    lazy={true}
                    height={50}
                    BunqJSClient={this.props.BunqJSClient}
                />
            </Avatar>
        );
        let itemAvatar = avatarStandalone;
        if (savingsAutoSaveResult.eventCount > 1) {
            itemAvatar = (
                <Badge
                    badgeContent={savingsAutoSaveResult.eventCount}
                    color="primary"
                    classes={{ badge: this.props.classes.badge }}
                >
                    {avatarStandalone}
                </Badge>
            );
        }

        const primaryText = savingsAutoSaveResultPrimaryText(savingsAutoSaveResult, t, accounts);
        const secondaryText = eventGenericText({ type: "SavingsAutoSaveResult", object: savingsAutoSaveResult }, t);

        return [
            <ListItem button onClick={this.toggleExtraInfo}>
                {itemAvatar}
                <ListItemText primary={primaryText} secondary={secondaryText} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    <MoneyAmountLabel style={styles.moneyAmountLabel} info={savingsAutoSaveResult} type="event">
                        {formattedTotalPaid}
                    </MoneyAmountLabel>
                </ListItemSecondaryAction>
            </ListItem>,
            <Collapse in={this.state.extraInfoOpen} unmountOnExit>
                <ListItem dense>
                    <ListItemText primary={t("Created")} secondary={createdDate} />
                </ListItem>

                {updatedDate !== createdDate ? (
                    <ListItem dense>
                        <ListItemText primary={t("Updated")} secondary={updatedDate} />
                    </ListItem>
                ) : null}

                <ListItem button dense onClick={this.togglePayments}>
                    <ListItemText primary={t("Number of payments")} secondary={"" + numberOfPayments} />
                    <ListItemSecondaryAction>
                        <Icon color="action">
                            {this.state.paymentsOpen ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </Icon>
                    </ListItemSecondaryAction>
                </ListItem>

                <Collapse in={this.state.paymentsOpen} unmountOnExit>
                    {savingsAutoSaveEntries.map(savingsAutoSaveEntry => {
                        return (
                            <PaymentListItem
                                accounts={accounts}
                                payment={savingsAutoSaveEntry.payment_savings}
                                BunqJSClient={this.props.BunqJSClient}
                            />
                        );
                    })}
                </Collapse>
            </Collapse>,
            <Divider style={{ marginBottom: this.state.paymentsOpen ? 12 : 0 }} />
        ];
    }
}

SavingsAutoSaveResultListItem.defaultProps = {
    minimalDisplay: false
};

export default withTheme()(translate("translations")(withStyles(classStyles)(SavingsAutoSaveResultListItem)));

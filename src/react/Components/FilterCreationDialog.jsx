import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import NavLink from "./Routing/NavLink";
import { formatIban } from "../Helpers/Utils";

export default props => {
    const { t, item, open, onClose } = props;

    const valueRuleWithText = t("Value rule with");
    const transactionAmountRuleWithText = t("Transaction amount rule with");

    const copyItems = [];
    if (item.description) {
        copyItems.push(
            <ListItem
                button
                divider
                component={NavLink}
                to={`/rule-page/null?value=${item.description}&field=DESCRIPTION`}
            >
                <ListItemText primary={t("Description")} secondary={`${valueRuleWithText}: ${item.description}`} />
            </ListItem>
        );
    }
    if (item.counterparty_alias && item.counterparty_alias.iban) {
        copyItems.push(
            <ListItem
                button
                divider
                component={NavLink}
                to={`/rule-page/null?value=${item.counterparty_alias.iban}&field=IBAN`}
            >
                <ListItemText
                    primary={"IBAN"}
                    secondary={`${valueRuleWithText}: ${formatIban(item.counterparty_alias.iban)}`}
                />
            </ListItem>
        );
    }
    if (item.counterparty_alias && item.counterparty_alias.display_name) {
        copyItems.push(
            <ListItem
                button
                divider
                component={NavLink}
                to={`/rule-page/null?value=${item.counterparty_alias.display_name}&field=COUNTERPARTY_NAME`}
            >
                <ListItemText
                    primary={t("Counterparty name")}
                    secondary={`${valueRuleWithText}: ${item.counterparty_alias.display_name}`}
                />
            </ListItem>
        );
    }
    if (typeof item.getAmount === "function") {
        const rawAmount = item.getAmount();
        const amount = rawAmount < 0 ? rawAmount * -1 : rawAmount;

        copyItems.push(
            <ListItem button divider component={NavLink} to={`/rule-page/null?amount=${amount}&match_type=EXACTLY`}>
                <ListItemText primary={t("Amount")} secondary={`${transactionAmountRuleWithText}: ${amount}`} />
            </ListItem>
        );
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("Create a filter for this event")}</DialogTitle>
            <DialogContent>
                <List>
                    {copyItems.length > 0 ? (
                        copyItems
                    ) : (
                        <ListItem>
                            <ListItemText primary="primary text" secondary="secondary text" />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button variant="raised" onClick={onClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

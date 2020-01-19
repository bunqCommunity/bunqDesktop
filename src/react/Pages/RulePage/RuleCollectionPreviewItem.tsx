import * as React from "react";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CheckIcon from "@material-ui/icons/Check";
import CrossIcon from "@material-ui/icons/Cancel";

import { EventObjectMatchingRule, EventObjectResult } from "../../Types/RuleCollection";
import TypeRule from "../../Types/Rules/TypeRule";
import ValueRule from "../../Types/Rules/ValueRule";
import TransactionAmountRule from "../../Types/Rules/TransactionAmountRule";
import CopyToClipboardWrap from "../../Components/CopyToClipboardWrap";

const styles = {};

class RuleCollectionPreviewItem extends React.Component<any, any> {
    state = {
        open: false,
        tabIndex: 0
    };

    handleChange = (event, value) => {
        this.setState({ tabIndex: value });
    };

    copiedValue = e => {
        this.props.openSnackbar(this.props.t(`Copied the value to your clipboard`));
    };

    render() {
        const t = this.props.t;
        const event: EventObjectResult = this.props.event;
        const matchingRules: EventObjectMatchingRule[] = event.matchingRules;

        let ruleItems = null;
        if (this.state.tabIndex === 0) {
            ruleItems = matchingRules.map((matchingRule: EventObjectMatchingRule, key) => {
                let negativeText = matchingRule.matched ? "" : "not";

                let primaryText = "";
                switch (matchingRule.rule.ruleType) {
                    case "ITEM_TYPE":
                        let ruleItemType: TypeRule = matchingRule.rule;

                        primaryText = `Event is ${negativeText} a ${ruleItemType.matchType}`;

                        break;
                    case "VALUE":
                        let ruleValue: ValueRule = matchingRule.rule;
                        let fieldChecked = ruleValue.field !== "CUSTOM" ? ruleValue.field : ruleValue.customField;

                        primaryText = `Field ${fieldChecked} does ${negativeText} ${ruleValue.matchType} '${matchingRule.rule.value}'`;

                        break;
                    case "TRANSACTION_AMOUNT":
                        let ruleTransactionAMount: TransactionAmountRule = matchingRule.rule;

                        primaryText = `Transaction amount is ${negativeText} ${ruleTransactionAMount.matchType} than ${ruleTransactionAMount.amount}`;

                        break;
                }

                return (
                    <ListItem dense key={key}>
                        <ListItemText primary={primaryText} secondary={`Rule type: ${matchingRule.rule.ruleType}`} />
                        <ListItemIcon>{matchingRule.matched ? <CheckIcon /> : <CrossIcon />}</ListItemIcon>
                    </ListItem>
                );
            });
        }

        let valueItems = null;
        if (this.state.tabIndex === 1) {
            // these keys will be checked in the object to display them when possible
            valueItems = [];
            const valueKeys = [
                { text: t("Description"), key: "description" },
                { text: t("IBAN"), key: "counterparty_alias.iban" },
                {
                    text: t("Counterparty name"),
                    key: "counterparty_alias.display_name"
                }
            ];
            valueKeys.forEach((valueKey, key) => {
                let foundValue = false;
                if (event.item[valueKey.key]) {
                    // value exists, add the list item
                    foundValue = event.item[valueKey.key];
                } else {
                    const keyParts = valueKey.key.split(".");

                    // check all parts of the target key
                    let reference = event.item;
                    keyParts.forEach(keyPart => {
                        if (reference[keyPart]) {
                            reference = reference[keyPart];
                        } else {
                            reference = false;
                        }
                    });

                    if (reference) foundValue = reference;
                }

                if (foundValue) {
                    valueItems.push(
                        <CopyToClipboardWrap key={key} text={foundValue} onCopy={this.copiedValue}>
                            <ListItem dense button>
                                <ListItemText primary={valueKey.text} secondary={foundValue} />
                            </ListItem>
                        </CopyToClipboardWrap>
                    );
                }
            });
        }

        return (
            <React.Fragment>
                <ListItem dense button onClick={() => this.setState({ open: !this.state.open })}>
                    <Avatar>{event.matches ? <CheckIcon /> : <CrossIcon />}</Avatar>
                    <ListItemText primary={`${event.item.description}`} secondary={`Type: ${event.type}`} />
                </ListItem>

                <Collapse in={this.state.open} unmountOnExit>
                    <AppBar position="static">
                        <Tabs value={this.state.tabIndex} onChange={this.handleChange}>
                            <Tab label="Rules" />
                            <Tab label="Values" />
                        </Tabs>
                    </AppBar>

                    {this.state.tabIndex === 0 && ruleItems}
                    {this.state.tabIndex === 1 && valueItems}
                    <Divider />
                </Collapse>
            </React.Fragment>
        );
    }
}

export default RuleCollectionPreviewItem;

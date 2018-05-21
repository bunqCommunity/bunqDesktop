import * as React from "react";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import CheckIcon from "@material-ui/icons/Check";
import CrossIcon from "@material-ui/icons/Cancel";
import {
    EventObjectMatchingRule,
    EventObjectResult
} from "../../Types/RuleCollection";
import TypeRule from "../../Types/Rules/TypeRule";
import ValueRule from "../../Types/Rules/ValueRule";
import TransactionAmountRule from "../../Types/Rules/TransactionAmountRule";

const styles = {};

class RuleCollectionPreviewItem extends React.Component<any, any> {
    state = {
        open: false
    };

    render() {
        const event: EventObjectResult = this.props.event;
        const matchingRules: EventObjectMatchingRule[] = event.matchingRules;

        const ruleItems = matchingRules.map(
            (matchingRule: EventObjectMatchingRule, key) => {
                let negativeText = matchingRule.matched ? "" : "not";

                let primaryText = "";
                switch (matchingRule.rule.ruleType) {
                    case "ITEM_TYPE":
                        let ruleItemType: TypeRule = matchingRule.rule;

                        primaryText = `Event is ${negativeText} a ${ruleItemType.matchType}`;

                        break;
                    case "VALUE":
                        let ruleValue: ValueRule = matchingRule.rule;
                        let fieldChecked =
                            ruleValue.field !== "CUSTOM"
                                ? ruleValue.field
                                : ruleValue.customField;

                        primaryText = `Field ${fieldChecked} does ${negativeText} ${ruleValue.matchType}`;

                        break;
                    case "TRANSACTION_AMOUNT":
                        let ruleTransactionAMount: TransactionAmountRule =
                            matchingRule.rule;

                        primaryText = `Transaction amount is ${negativeText} ${ruleTransactionAMount.matchType} than ${ruleTransactionAMount.amount}`;

                        break;
                }

                return (
                    <ListItem dense key={key}>
                        <ListItemText
                            primary={primaryText}
                            secondary={`Rule type: ${matchingRule.rule
                                .ruleType}`}
                        />
                        <ListItemIcon>
                            {matchingRule.matched ? (
                                <CheckIcon />
                            ) : (
                                <CrossIcon />
                            )}
                        </ListItemIcon>
                    </ListItem>
                );
            }
        );

        return (
            <React.Fragment>
                <ListItem
                    dense
                    button
                    onClick={() => this.setState({ open: !this.state.open })}
                >
                    <Avatar>
                        {event.matches ? <CheckIcon /> : <CrossIcon />}
                    </Avatar>
                    <ListItemText
                        primary={`${event.item.description}`}
                        secondary={`Type: ${event.type}`}
                    />
                </ListItem>
                <Collapse in={this.state.open} unmountOnExit>
                    {ruleItems}
                </Collapse>
            </React.Fragment>
        );
    }
}

export default RuleCollectionPreviewItem;

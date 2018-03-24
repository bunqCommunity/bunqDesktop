import * as React from "react";
import Select from "material-ui/Select";
import Input from "material-ui/Input";
import Typography from "material-ui/Typography";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";

import RuleItemMenu from "../RuleItemMenu";
import TypeRule from "../../../Types/Rules/TypeRule";

interface IPropTypes {
    rule: TypeRule;
    removeRule: any;
    updateRule: any;
    openExportDialog: any;
}

const styles = {
    textField: {
        width: "100%"
    },
    tableCell: {
        padding: 6,
        width: "auto",
        maxWidth: 300,
        minWidth: 150
    },
    tableIconCell: {
        width: 48
    }
};

class ItemTypeRuleItem extends React.Component<IPropTypes, any> {
    constructor(props: IPropTypes, context: any) {
        super(props, context);
        this.state = {
            rule: this.props.rule
        };
    }

    handleMatchTypeChange = event => {
        const rule: TypeRule = this.props.rule;
        rule.matchType = event.target.value;
        this.props.updateRule(rule);
    };

    render() {
        const rule: TypeRule = this.props.rule;

        return [
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subheading">Event type</Typography>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={rule.matchType}
                                onChange={this.handleMatchTypeChange}
                                input={
                                    <Input
                                        name="match-type"
                                        id="match-type-helper"
                                    />
                                }
                            >
                                <MenuItem value={"PAYMENT"}>
                                    Payment or card payment
                                </MenuItem>
                                <MenuItem value={"REGULAR_PAYMENT"}>
                                    Payment
                                </MenuItem>
                                <MenuItem value={"PAYMENT_RECEIVED"}>
                                    Received payment
                                </MenuItem>
                                <MenuItem value={"PAYMENT_SENT"}>
                                    Sent payment
                                </MenuItem>
                                <MenuItem value={"BUNQ_ME_TAB"}>
                                    bunq.me request
                                </MenuItem>
                                <MenuItem value={"MASTERCARD_PAYMENT"}>
                                    Card payments (Maestro or Mastercard)
                                </MenuItem>
                                <MenuItem value={"REQUEST"}>
                                    Request (sent and received)
                                </MenuItem>
                                <MenuItem value={"REQUEST_INQUIRY"}>
                                    Sent request
                                </MenuItem>
                                <MenuItem value={"REQUEST_RESPONSE"}>
                                    Received request
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>{null}</TableCell>

                    <TableCell style={styles.tableIconCell}>
                        <RuleItemMenu
                            removeRule={this.props.removeRule}
                            rule={this.state.rule}
                            openExportDialog={this.props.openExportDialog}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        ];
    }
}

export default ItemTypeRuleItem;

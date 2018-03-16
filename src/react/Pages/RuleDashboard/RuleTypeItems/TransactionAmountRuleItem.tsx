import * as React from "react";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Input from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";

import { TransactionAmountRule } from "../Types/Types";
import RuleItemMenu from "../RuleItemMenu";

interface IPropTypes {
    rule: TransactionAmountRule;
    removeRule: any;
    updateRule: any;
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

class TransactionAmountRuleItem extends React.Component<IPropTypes, any> {
    constructor(props: IPropTypes, context: any) {
        super(props, context);
        this.state = {
            rule: this.props.rule
        };
    }

    handleMatchTypeChange = event => {
        const rule: TransactionAmountRule = this.props.rule;
        rule.matchType = event.target.value;
        this.props.updateRule(rule);
    };

    handleValueChange = event => {
        const rule: TransactionAmountRule = this.props.rule;
        rule.amount = event.target.value;
        this.props.updateRule(rule);
    };

    render() {
        const rule: TransactionAmountRule = this.props.rule;

        const moneyFieldProps = {
            min: 0,
            step: 0.01
        };

        return [
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell>Transaction amount</TableCell>

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
                                <MenuItem value={"MORE"}>More than</MenuItem>
                                <MenuItem value={"MORE_EQUALS"}>
                                    Equals or more than
                                </MenuItem>
                                <MenuItem value={"LESS"}>Less than</MenuItem>
                                <MenuItem value={"LESS_EQUALS"}>
                                    Equals or less than
                                </MenuItem>
                            </Select>
                            {/*<FormHelperText>*/}
                                {/*How to check the amount*/}
                            {/*</FormHelperText>*/}
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <TextField
                            style={styles.textField}
                            value={rule.amount}
                            type={"number"}
                            onChange={this.handleValueChange}
                            helperText={"Amount to check"}
                            {...moneyFieldProps}
                        />
                    </TableCell>

                    <TableCell style={styles.tableIconCell}>
                        <RuleItemMenu removeRule={this.props.removeRule} />
                    </TableCell>
                </TableRow>
            </TableBody>
        ];
    }
}

export default TransactionAmountRuleItem;

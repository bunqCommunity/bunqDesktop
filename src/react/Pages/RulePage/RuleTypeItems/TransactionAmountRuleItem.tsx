import * as React from "react";
import Select from "material-ui/Select";
import Input from "material-ui/Input";
import Typography from "material-ui/Typography";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";

import MoneyFormatInputDefault from "../../../Components/FormFields/MoneyFormatInputDefault";
import { TransactionAmountRule } from "../../../Types/Rules/TransactionAmountRule";
import RuleItemMenu from "../RuleItemMenu";

interface IPropTypes {
    rule: TransactionAmountRule;
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

        return [
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subheading">
                            Transaction amount
                        </Typography>
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
                        {/*<TextField*/}
                        {/*style={styles.textField}*/}
                        {/*value={rule.amount}*/}
                        {/*type={"number"}*/}
                        {/*onChange={this.handleValueChange}*/}
                        {/*/>*/}
                        <FormControl error={this.state.amountError} fullWidth>
                            <MoneyFormatInputDefault
                                id="amount"
                                fontSize={16}
                                style={styles.textField}
                                value={rule.amount}
                                onChange={this.handleValueChange}
                            />
                        </FormControl>
                    </TableCell>

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

export default TransactionAmountRuleItem;

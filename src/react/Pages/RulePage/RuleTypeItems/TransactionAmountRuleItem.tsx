import * as React from "react";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import MoneyFormatInputDefault from "../../../Components/FormFields/MoneyFormatInputDefault";
import TransactionAmountRule from "../../../Types/Rules/TransactionAmountRule";
import RuleItemMenu2 from "../RuleItemMenu";
const RuleItemMenu: any = RuleItemMenu2;

import TranslateTypography2 from "../../../Components/TranslationHelpers/Typography";
import TranslateMenuItem2 from "../../../Components/TranslationHelpers/MenuItem";
const TranslateTypography: any = TranslateTypography2;
const TranslateMenuItem: any = TranslateMenuItem2;

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

        return (
            <TableRow>
                <TableCell>
                    <TranslateTypography variant="subtitle1">Transaction amount</TranslateTypography>
                </TableCell>

                <TableCell style={styles.tableCell}>
                    <FormControl style={styles.textField}>
                        <Select
                            value={rule.matchType}
                            onChange={this.handleMatchTypeChange}
                            input={<Input name="match-type" id="match-type-helper" />}
                        >
                            <TranslateMenuItem value={"MORE"}>More than</TranslateMenuItem>
                            <TranslateMenuItem value={"MORE_EQUALS"}>Equals or more than</TranslateMenuItem>
                            <TranslateMenuItem value={"EXACTLY"}>Exactly</TranslateMenuItem>
                            <TranslateMenuItem value={"LESS"}>Less than</TranslateMenuItem>
                            <TranslateMenuItem value={"LESS_EQUALS"}>Equals or less than</TranslateMenuItem>
                        </Select>
                    </FormControl>
                </TableCell>

                <TableCell style={styles.tableCell}>
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
        );
    }
}

export default TransactionAmountRuleItem;

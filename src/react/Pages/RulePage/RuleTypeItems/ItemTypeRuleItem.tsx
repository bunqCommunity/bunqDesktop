import * as React from "react";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import TypeRule from "../../../Types/Rules/TypeRule";
import RuleItemMenu2 from "../RuleItemMenu";
const RuleItemMenu: any = RuleItemMenu2;

import TranslateTypography2 from "../../../Components/TranslationHelpers/Typography";
import TranslateMenuItem2 from "../../../Components/TranslationHelpers/MenuItem";
const TranslateTypography: any = TranslateTypography2;
const TranslateMenuItem: any = TranslateMenuItem2;

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

        return (
            <TableRow>
                <TableCell>
                    <TranslateTypography variant="subheading">Event type</TranslateTypography>
                </TableCell>

                <TableCell style={styles.tableCell}>
                    <FormControl style={styles.textField}>
                        <Select
                            value={rule.matchType}
                            onChange={this.handleMatchTypeChange}
                            input={<Input name="match-type" id="match-type-helper" />}
                        >
                            <TranslateMenuItem value={"PAYMENT"}>Payment or card payment</TranslateMenuItem>
                            <TranslateMenuItem value={"REGULAR_PAYMENT"}>Payment</TranslateMenuItem>
                            <TranslateMenuItem value={"PAYMENT_RECEIVED"}>Received payment</TranslateMenuItem>
                            <TranslateMenuItem value={"PAYMENT_SENT"}>Sent payment</TranslateMenuItem>
                            <TranslateMenuItem value={"BUNQ_ME_TAB"}>bunqme request</TranslateMenuItem>
                            <TranslateMenuItem value={"MASTERCARD_PAYMENT"}>
                                Card payments (Maestro or Mastercard)
                            </TranslateMenuItem>
                            <TranslateMenuItem value={"REQUEST"}>Request (sent and received)</TranslateMenuItem>
                            <TranslateMenuItem value={"REQUEST_INQUIRY"}>Sent request</TranslateMenuItem>
                            <TranslateMenuItem value={"REQUEST_RESPONSE"}>Received request</TranslateMenuItem>
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
        );
    }
}

export default ItemTypeRuleItem;

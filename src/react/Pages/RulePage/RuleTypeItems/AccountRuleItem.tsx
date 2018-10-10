import * as React from "react";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { AccountRule } from "../../../Types/Rules/AccountRule";
import RuleItemMenu2 from "../RuleItemMenu";
const RuleItemMenu: any = RuleItemMenu2;

import AccountSelectorDialog from "../../../Components/FormFields/AccountSelectorDialog";
import TranslateMenuItem2 from "../../../Components/TranslationHelpers/MenuItem";
const TranslateMenuItem: any = TranslateMenuItem2;

interface IPropTypes {
    BunqJSClient: any;
    rule: AccountRule;
    accounts: any[];
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

class AccountRuleItem extends React.Component<IPropTypes, any> {
    constructor(props: IPropTypes, context: any) {
        super(props, context);
        this.state = {
            rule: this.props.rule
        };
    }

    handleAccountChange = value => {
        const accountInfo = this.props.accounts[value];

        const rule: AccountRule = this.props.rule;
        rule.accountId = accountInfo.id;
        this.props.updateRule(rule);
    };

    handlePaymentTypeChange = event => {
        const rule: AccountRule = this.props.rule;
        rule.paymentType = event.target.value;
        this.props.updateRule(rule);
    };

    render() {
        const rule: AccountRule = this.props.rule;

        const accountIndex = this.props.accounts.findIndex((account: any) => {
            return account.id === rule.accountId;
        });

        return (
            <TableRow>
                <TableCell style={styles.tableCell}>
                    <AccountSelectorDialog
                        value={accountIndex}
                        onChange={this.handleAccountChange}
                        accounts={this.props.accounts}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                </TableCell>

                <TableCell> </TableCell>

                <TableCell style={styles.tableCell}>
                    <FormControl style={styles.textField}>
                        <Select
                            value={rule.paymentType}
                            onChange={this.handlePaymentTypeChange}
                            input={<Input name="payment-type" id="payment-type-helper" />}
                        >
                            <TranslateMenuItem value={"RECEIVES"}>Receives money</TranslateMenuItem>
                            <TranslateMenuItem value={"SENDS"}>Sends money</TranslateMenuItem>
                            <TranslateMenuItem value={"ALL"}>All payments</TranslateMenuItem>
                        </Select>
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

export default AccountRuleItem;

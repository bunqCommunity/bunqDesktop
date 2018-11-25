import * as React from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { ValueRule } from "../../../Types/Rules/ValueRule";
import RuleItemMenu2 from "../RuleItemMenu";
const RuleItemMenu: any = RuleItemMenu2;

import TranslateMenuItem2 from "../../../Components/TranslationHelpers/MenuItem";
const TranslateMenuItem: any = TranslateMenuItem2;

interface IPropTypes {
    rule: ValueRule;
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

class ValueRuleItem extends React.Component<IPropTypes, any> {
    constructor(props: IPropTypes, context: any) {
        super(props, context);
        this.state = {
            rule: this.props.rule,
            textFieldError: false
        };
    }

    handleFieldChange = event => {
        const rule: ValueRule = this.props.rule;
        rule.field = event.target.value;
        this.props.updateRule(rule);
    };

    handleMatchTypeChange = event => {
        const rule: ValueRule = this.props.rule;
        rule.matchType = event.target.value;
        this.props.updateRule(rule);
    };

    handleCustomFieldChange = event => {
        const rule: ValueRule = this.props.rule;
        rule.customField = event.target.value;
        this.props.updateRule(rule);
    };

    handleValueChange = event => {
        const textFieldValue = event.target.value;
        const rule: ValueRule = this.props.rule;

        let hasError = false;
        switch (rule.matchType) {
            case "REGEX": {
                // check if regex is valid
                try {
                    const regexTest = new RegExp(textFieldValue);
                    // scream in horror as we test the regex
                    regexTest.test("1");
                } catch (err) {
                    // error occured so regex is invalid
                    hasError = true;
                }
                break;
            }
            default:
                // all other matchTypes just need a non-empty value
                hasError = textFieldValue.length === 0;
        }

        // update field error state
        this.setState({ textFieldError: hasError });
        rule.value = textFieldValue;
        this.props.updateRule(rule);
    };

    render() {
        const rule: ValueRule = this.props.rule;

        return (
            <TableRow>
                <TableCell style={styles.tableCell}>
                    <FormControl style={styles.textField}>
                        <Select
                            value={rule.field}
                            onChange={this.handleFieldChange}
                            input={<Input name="field" id="field-helper" />}
                        >
                            <TranslateMenuItem value={"IBAN"}>IBAN number</TranslateMenuItem>
                            <TranslateMenuItem value={"DESCRIPTION"}>Description</TranslateMenuItem>
                            <TranslateMenuItem value={"COUNTERPARTY_NAME"}>Display name</TranslateMenuItem>
                            <TranslateMenuItem value={"CUSTOM"}>Other</TranslateMenuItem>
                        </Select>
                    </FormControl>

                    {rule.field === "CUSTOM" ? (
                        <FormControl style={styles.textField}>
                            <TextField
                                name="custom-field"
                                value={rule.customField}
                                onChange={this.handleCustomFieldChange}
                            />
                        </FormControl>
                    ) : null}
                </TableCell>

                <TableCell style={styles.tableCell}>
                    <FormControl style={styles.textField}>
                        <Select
                            value={rule.matchType}
                            onChange={this.handleMatchTypeChange}
                            input={<Input name="age" id="match-type-helper" />}
                        >
                            <TranslateMenuItem value={"CONTAINS"}>Contains text</TranslateMenuItem>
                            <TranslateMenuItem value={"EXACT"}>Matches exactly</TranslateMenuItem>
                            <TranslateMenuItem value={"STARTS_WITH"}>Starts with</TranslateMenuItem>
                            <TranslateMenuItem value={"ENDS_WITH"}>Ends with</TranslateMenuItem>
                            <TranslateMenuItem value={"REGEX"}>Regex</TranslateMenuItem>
                        </Select>
                        {/*<FormHelperText>*/}
                        {/*How to check the field*/}
                        {/*</FormHelperText>*/}
                    </FormControl>
                </TableCell>

                <TableCell style={styles.tableCell}>
                    <TextField
                        error={this.state.textFieldError}
                        style={styles.textField}
                        value={rule.value}
                        onChange={this.handleValueChange}
                    />
                </TableCell>
                {/*helperText={"Value to check for"}*/}

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

export default ValueRuleItem;

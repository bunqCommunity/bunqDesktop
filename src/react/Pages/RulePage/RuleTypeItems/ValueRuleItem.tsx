import * as React from "react";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Input from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";

import { ValueRule } from "../../../Types/Rules/ValueRule";
import RuleItemMenu from "../RuleItemMenu";

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
            rule: this.props.rule
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

    handleValueChange = event => {
        const rule: ValueRule = this.props.rule;
        rule.value = event.target.value;
        this.props.updateRule(rule);
    };

    render() {
        const rule: ValueRule = this.props.rule;

        return [
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={rule.field}
                                onChange={this.handleFieldChange}
                                input={<Input name="field" id="field-helper" />}
                            >
                                <MenuItem value={"IBAN"}>IBAN number</MenuItem>
                                <MenuItem value={"DESCRIPTION"}>
                                    Description
                                </MenuItem>
                                <MenuItem value={"COUNTERPARTY_NAME"}>
                                    Display name
                                </MenuItem>
                            </Select>
                            {/*<FormHelperText>*/}
                            {/*Which field to check*/}
                            {/*</FormHelperText>*/}
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={rule.matchType}
                                onChange={this.handleMatchTypeChange}
                                input={
                                    <Input name="age" id="match-type-helper" />
                                }
                            >
                                <MenuItem value={"EXACT"}>
                                    Matches exactly
                                </MenuItem>
                                <MenuItem value={"CONTAINS"}>
                                    Contains text
                                </MenuItem>
                                <MenuItem value={"STARTS_WITH"}>
                                    Starts with
                                </MenuItem>
                                <MenuItem value={"ENDS_WITH"}>
                                    Ends with
                                </MenuItem>
                                <MenuItem value={"REGEX"}>Regex</MenuItem>
                            </Select>
                            {/*<FormHelperText>*/}
                            {/*How to check the field*/}
                            {/*</FormHelperText>*/}
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <TextField
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
            </TableBody>
        ];
    }
}

export default ValueRuleItem;

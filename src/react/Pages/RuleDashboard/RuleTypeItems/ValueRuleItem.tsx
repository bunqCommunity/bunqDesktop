import * as React from "react";
import Select from "material-ui/Select";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";

import { ValueRule } from "../Types/Types";

interface IPropTypes {
    rule: ValueRule;
    removeRule: any;
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

    componentDidUpdate() {
        const rule: ValueRule = this.state.rule;
        const propsRule: ValueRule = this.props.rule;

        if (rule.id !== propsRule.id) {
            this.setState({
                rule: propsRule
            });
        }
    }

    handleFieldChange = event => {
        const rule: ValueRule = this.state.rule;
        rule.field = event.target.value;
        this.setState({ rule: rule });
    };

    handleMatchTypeChange = event => {
        const rule: ValueRule = this.state.rule;
        rule.matchType = event.target.value;
        this.setState({ rule: rule });
    };

    handleValueChange = event => {
        const rule: ValueRule = this.state.rule;
        rule.value = event.target.value;
        this.setState({ rule: rule });
    };

    render() {
        const rule: ValueRule = this.state.rule;

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
                                <MenuItem value={"IBAN"}>Iban</MenuItem>
                                <MenuItem value={"DESCRIPTION"}>
                                    Description
                                </MenuItem>
                                <MenuItem value={"COUNTERPARTY_NAME"}>
                                    Display name
                                </MenuItem>
                            </Select>
                            <FormHelperText>
                                Which field to check
                            </FormHelperText>
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
                                <MenuItem value={"REGEX"}>Regex</MenuItem>
                            </Select>
                            <FormHelperText>
                                How to check the field
                            </FormHelperText>
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <TextField
                            style={styles.textField}
                            value={rule.value}
                            onChange={this.handleValueChange}
                            helperText={"Value to check for"}
                        />
                    </TableCell>

                    <TableCell style={styles.tableIconCell}>
                        <Button
                            color="secondary"
                            onClick={this.props.removeRule}
                        >
                            Remove
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        ];
    }
}

export default ValueRuleItem;

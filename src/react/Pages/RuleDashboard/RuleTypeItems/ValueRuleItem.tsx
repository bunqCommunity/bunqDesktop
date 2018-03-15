import * as React from "react";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import { TableBody, TableCell, TableRow } from "material-ui/Table";
import Select from "material-ui/Select";

import RemoveIcon from "material-ui-icons/Remove";

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
        padding: 2
    },
    tableIconCell: {
        padding: 2,
        width: 30
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
            this.setState( {
                rule: propsRule
            });
        }
    }

    public render() {
        const rule: ValueRule = this.state.rule;

        return [
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={rule.field}
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
                            defaultValue={rule.value}
                            helperText={"Value to check for"}
                        />
                    </TableCell>

                    <TableCell style={styles.tableIconCell}>
                        <IconButton onClick={this.props.removeRule}>
                            <RemoveIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </TableBody>
        ];
    }
}

export default ValueRuleItem;

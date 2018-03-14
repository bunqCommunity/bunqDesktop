import * as React from "react";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import { TableBody, TableCell, TableHead, TableRow } from "material-ui/Table";
import Select from "material-ui/Select";

import { ValueFilter } from "../Types/Types";

interface IPropTypes {
    filter: ValueFilter;
}

const styles = {
    textField: {
        width: "100%"
    },
    tableCell: {
        padding: 2
    }
};

class ValueFilterItem extends React.Component<IPropTypes, any> {
    constructor(props: IPropTypes, context: any) {
        super(props, context);
        this.state = {};
    }

    public render() {
        const filter: ValueFilter = this.props.filter;

        return [
            <TableHead key={"tableHead"}>
                <TableRow>
                    <TableCell style={{width: 70}}>Filter type</TableCell>
                    <TableCell style={{width: 90}}>Type</TableCell>
                    <TableCell style={{width: 90}}>Match</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>,
            <TableBody key={"tableBody"}>
                <TableRow>
                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={filter.filterType}
                                input={
                                    <Input
                                        name="field"
                                        id="filter-type-helper"
                                    />
                                }
                            >
                                <MenuItem value={"VALUE"}>Default</MenuItem>
                            </Select>
                            <FormHelperText>
                                Which field to check
                            </FormHelperText>
                        </FormControl>
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={filter.field}
                                input={<Input name="field" id="field-helper" />}
                            >
                                <MenuItem value={"IBAN"}>Iban</MenuItem>
                                <MenuItem value={"DESCRIPTION"}>
                                    Description
                                </MenuItem>
                                <MenuItem value={"COUNTERPARTY_NAME"}>
                                    Display name
                                </MenuItem>
                                {/*<MenuItem value={"CUSTOM"}>Custom</MenuItem>*/}
                            </Select>
                            <FormHelperText>
                                Which field to check
                            </FormHelperText>
                        </FormControl>
                        {/*<TextField*/}
                        {/*style={styles.textField}*/}
                        {/*defaultValue={filter.matchType}*/}
                        {/*/>*/}
                    </TableCell>

                    <TableCell style={styles.tableCell}>
                        <FormControl style={styles.textField}>
                            <Select
                                value={filter.matchType}
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
                            defaultValue={filter.value}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        ];
    }
}

export default ValueFilterItem;

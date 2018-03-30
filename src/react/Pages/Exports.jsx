import React from "react";
import { subMonths } from "date-fns";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import DatePicker from "material-ui-pickers/DatePicker/index.js";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Paper from "material-ui/Paper";
import Icon from "material-ui/Icon";
import InputAdornment from "material-ui/Input/InputAdornment";
import Typography from "material-ui/Typography";

import ArrowBackIcon from "material-ui-icons/ArrowBack";

import { openSnackbar } from "../Actions/snackbar";
import { exportNew } from "../Actions/export";

const styles = {
    selectField: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    },
    button: {
        width: "100%"
    },
    dateInput: {
        width: "100%"
    },
    paper: {
        padding: 24
    }
};

class Exports extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            exportType: "CSV",
            regionalFormat: "EUROPEAN",
            dateToFilter: new Date(),
            dateFromFilter: subMonths(new Date(), 1)
        };
    }

    handleDateFromChange = date => {
        this.setState({
            dateFromFilter: date
        });
    };
    handleDateToChange = date => {
        this.setState({
            dateToFilter: date
        });
    };
    clearDateFrom = event => {
        this.setState({
            dateFromFilter: subMonths(new Date(), 1)
        });
    };
    clearDateTo = event => {
        this.setState({
            dateToFilter: new Date()
        });
    };

    handleExportTypeChange = event => {
        this.setState({
            exportType: event.target.value
        });
    };
    handleRegionalFormatChange = event => {
        this.setState({
            regionalFormat: event.target.value
        });
    };

    createNew = event => {
        this.props.exportNew();
    };

    render() {
        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Exports`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Typography variant={"headline"}>
                                    Exports
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="export-type-selection">
                                        Export type
                                    </InputLabel>
                                    <Select
                                        value={this.state.exportType}
                                        onChange={this.handleExportTypeChange}
                                        input={
                                            <Input id="export-type-selection" />
                                        }
                                        style={styles.selectField}
                                    >
                                        <MenuItem value={"CSV"}>CSV</MenuItem>
                                        <MenuItem value={"MT940"}>
                                            MT940
                                        </MenuItem>
                                        <MenuItem value={"PDF"}>PDF</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="regional-format-selection">
                                        Regional format
                                    </InputLabel>
                                    <Select
                                        value={this.state.regionalFormat}
                                        onChange={
                                            this.handleRegionalFormatChange
                                        }
                                        input={
                                            <Input id="regional-format-selection" />
                                        }
                                        style={styles.selectField}
                                    >
                                        <MenuItem value={"UK_US"}>
                                            UK_US (comma-separated)
                                        </MenuItem>
                                        <MenuItem value={"EUROPEAN"}>
                                            EUROPEAN (semicolon-separated)
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    id="from-date"
                                    helperText="From date"
                                    emptyLabel="No filter"
                                    format="MMMM DD, YYYY"
                                    disableFuture
                                    style={styles.dateInput}
                                    maxDate={this.state.dateToFilter}
                                    value={this.state.dateFromFilter}
                                    onChange={this.handleDateFromChange}
                                    clearable={true}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={this.clearDateFrom}
                                                >
                                                    <Icon>clear</Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    id="to-date"
                                    helperText="To date"
                                    emptyLabel="No filter"
                                    format="MMMM DD, YYYY"
                                    disableFuture
                                    style={styles.dateInput}
                                    minDate={this.state.dateFromFilter}
                                    value={this.state.dateToFilter}
                                    onChange={this.handleDateToChange}
                                    clearable={true}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={this.clearDateTo}
                                                >
                                                    <Icon>clear</Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Button variant="raised" color="primary">
                                    Create export
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsAccountId: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        exportNew: (...params) => dispatch(exportNew(BunqJSClient, ...params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Exports);

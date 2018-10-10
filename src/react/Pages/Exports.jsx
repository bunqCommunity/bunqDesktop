import React from "react";
import { translate } from "react-i18next";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format/index.js";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import DatePicker from "material-ui-pickers/DatePicker/index.js";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import InputAdornment from "@material-ui/core/InputAdornment";

import FolderIcon from "@material-ui/icons/Folder";
import RefreshIcon from "@material-ui/icons/Refresh";

import { shell } from "electron";
const remote = require("electron").remote;
const app = remote ? remote.app : {};
import fs from "../ImportWrappers/fs";
import path from "../ImportWrappers/path";

import AccountList from "../Components/AccountList/AccountList";
import TranslateTypography from "../Components/TranslationHelpers/Typography";
import TranslateButton from "../Components/TranslationHelpers/Button";
import CombinedList from "../Components/CombinedList/CombinedList";

import Logger from "../Helpers/Logger";
import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { humanReadableDate, formatIban } from "../Helpers/Utils";
import CategoryHelper from "../Helpers/CategoryHelper";

import { openSnackbar } from "../Actions/snackbar";
import { exportNew } from "../Actions/export_new";
import { exportInfoUpdate } from "../Actions/exports";
import { paymentFilter, masterCardActionFilter } from "../Helpers/DataFilters";

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
        padding: 24,
        marginBottom: 16
    }
};

class Exports extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            exportType: "CSV",
            regionalFormat: "EUROPEAN",
            dateTo: new Date(),
            dateFrom: subMonths(new Date(), 1),

            exportContentLoading: false,

            selectedTab: 0
        };
    }

    componentDidMount() {
        if (!this.props.limitedPermissions) {
            this.updateExports(this.props.user.id, this.props.accountsAccountId);
        } else {
            this.setState({
                selectedTab: 1
            });
        }
    }

    componentDidUpdate(oldProps) {
        // loading state from creating a new export changed to false
        if (this.props.exportNewLoading === false && this.props.exportNewLoading !== oldProps.exportNewLoading) {
            this.updateExports(this.props.user.id, this.props.accountsAccountId);
        }
    }

    paymentMapper = () => {
        return this.props.payments
            .filter(
                paymentFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    selectedAccountIds: this.props.selectedAccountIds,
                    toggleAccountIds: this.props.toggleAccountIds,

                    searchTerm: this.props.searchTerm,
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(payment => {
                const categories = CategoryHelper(
                    this.props.categories,
                    this.props.categoryConnections,
                    "Payment",
                    payment.id
                );

                return {
                    date: payment.created,
                    info: payment,
                    categories: categories
                };
            });
    };

    masterCardActionMapper = () => {
        return this.props.masterCardActions
            .filter(
                masterCardActionFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    selectedAccountIds: this.props.selectedAccountIds,
                    toggleAccountIds: this.props.toggleAccountIds,

                    searchTerm: this.props.searchTerm,
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(masterCardAction => {
                const categories = CategoryHelper(
                    this.props.categories,
                    this.props.categoryConnections,
                    "MasterCardAction",
                    masterCardAction.id
                );

                return {
                    date: masterCardAction.created,
                    info: masterCardAction,
                    categories: categories
                };
            });
    };

    updateExports = (userId, accountId) => {
        if (!this.props.initialBunqConnect) {
            return;
        }
        this.props.exportInfoUpdate(userId, accountId);
    };

    refreshClick = event => {
        this.updateExports(this.props.user.id, this.props.accountsAccountId);
    };

    handleDateFromChange = date => {
        this.setState({
            dateFrom: date
        });
    };
    handleDateToChange = date => {
        this.setState({
            dateTo: date
        });
    };
    clearDateFrom = event => {
        this.setState({
            dateFrom: subMonths(new Date(), 1)
        });
    };
    clearDateTo = event => {
        this.setState({
            dateTo: new Date()
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
        this.props.exportNew(
            this.props.user.id,
            this.props.accountsAccountId,
            this.state.exportType,
            this.state.dateFrom,
            this.state.dateTo,
            {
                regional_format: this.state.regionalFormat
            }
        );
    };

    loadExportContent = exportInfo => event => {
        if (!this.state.exportContentLoading) {
            this.setState({ exportContentLoading: true });

            let fileExtension = "";
            switch (exportInfo.statement_format) {
                case "CSV":
                    fileExtension = ".csv";
                    break;
                case "MT940":
                    fileExtension = ".txt";
                    break;
                case "PDF":
                    fileExtension = ".pdf";
                    break;
            }
            const fileName = `bunq-export.${exportInfo.date_start}_${exportInfo.date_end}_${
                exportInfo.id
            }${fileExtension}`;

            const failedMessage = this.props.t("We failed to load the export content for this monetary account");

            this.props.BunqJSClient.api.customerStatementExportContent
                .list(this.props.user.id, this.props.accountsAccountId, exportInfo.id)
                .then(exportContent => {
                    // create a new file reader
                    const fileReader = new FileReader();

                    // set event handler
                    fileReader.onload = result => {
                        // store the resulting arraybuffer in the downloads folder
                        this.storeFile(Buffer.from(new Uint8Array(result.target.result)), fileName);
                        this.setState({ exportContentLoading: false });
                    };

                    // read the blob result
                    fileReader.readAsArrayBuffer(exportContent);
                })
                .catch(error => {
                    this.setState({ exportContentLoading: false });
                    BunqErrorHandler(dispatch, error, failedMessage);
                });
        }
    };

    createCustomExport = () => {
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();

        const events = [...masterCardActions, ...payments]
            .sort(function(a, b) {
                return b.date - a.date;
            })
            .reverse();

        const columnNames = [
            "Date",
            "Time",
            "Amount",
            "Account",
            "Counterparty",
            "Name",
            "Description",
            "Categories",
            "EventType",
            "EventId",
            "Type",
            "SubType",
            "AuthorisationStatus",
            "AuthorisationType"
        ];

        const columnRows = [];
        events.forEach(event => {
            const info = event.info;
            const labels = event.categories.map(category => category.label);
            columnRows.push([
                format(event.date, "YYYY-MM-dd"),
                format(event.date, "HH:mm:ss"),
                info.getDelta(),
                info.alias.iban ? formatIban(info.alias.iban) : null,
                info.counterparty_alias.iban ? formatIban(info.counterparty_alias.iban) : null,
                info.counterparty_alias.display_name,
                info.description.replace("\n", " "),
                labels.join(","),
                info.eventType,
                info.id,
                info.type,
                info.sub_type,
                info.authorisation_status,
                info.authorisation_type
            ]);
        });

        let resultingCsv = columnNames.join(";");
        columnRows.forEach(row => {
            resultingCsv += `\n${row.join(";")}`;
        });

        // if no from date is set, the export targets the oldest event
        const dateFromFilter = this.props.dateFromFilter ? this.props.dateFromFilter : events[0].date;
        // if no date is set the bunqdesktop app creates a date range which defaults to today
        const dateToFilter = this.props.dateToFilter ? this.props.dateToFilter : new Date();

        // format a file name
        const startDateLabel = format(dateFromFilter, "YYYY-MM-dd");
        const endDateLabel = format(dateToFilter, "YYYY-MM-dd");
        const fileName = `bunqdesktop-export.${startDateLabel}_${endDateLabel}.csv`;

        // store the file using our custom output
        this.storeFile(resultingCsv, fileName);
    };

    /**
     * Stores content in the downloads folder using a given name
     * @param content
     * @param fileName
     */
    storeFile = (content, fileName) => {
        const downloadDir = app.getPath("downloads");
        const targetFile = `${downloadDir}${path.sep}${fileName}`;

        const successMessage = this.props.t("Stored file at ");
        const failedMessage = this.props.t("Failed to store the export file at ");

        try {
            fs.writeFileSync(targetFile, content);

            this.props.openSnackbar(`${successMessage}${targetFile}`);
        } catch (ex) {
            Logger.error(ex);
            this.props.openSnackbar(`${failedMessage}${targetFile}`);
        }
    };

    render() {
        const { t, limitedPermissions } = this.props;

        const exportItems = this.props.exports.map((exportItem, key) => {
            const exportInfo = exportItem.CustomerStatement;
            const primary = `Start ${exportInfo.date_start} - End ${exportInfo.date_end}`;
            const secondary = `Created: ${humanReadableDate(exportInfo.created)}`;

            const statementFormat = exportInfo.statement_format === "MT940" ? "MT" : exportInfo.statement_format;

            return (
                <ListItem button key={key} onClick={this.loadExportContent(exportInfo)}>
                    <Avatar style={{ margin: 10 }}>{statementFormat}</Avatar>
                    <ListItemText primary={primary} secondary={secondary} />
                </ListItem>
            );
        });

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Exports")}`}</title>
                </Helmet>

                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList
                            updateExternal={this.updateExports}
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <AppBar position="static">
                        <Tabs
                            value={this.state.selectedTab}
                            onChange={(event, value) => this.setState({ selectedTab: value })}
                        >
                            {limitedPermissions ? null : <Tab value={0} label="bunq Exports" />}
                            <Tab value={1} label="Custom Exports" />
                        </Tabs>
                    </AppBar>

                    {this.state.selectedTab === 0 ? (
                        <React.Fragment>
                            <Paper style={styles.paper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <TranslateTypography variant="h5">New export</TranslateTypography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl style={styles.formControl}>
                                            <InputLabel htmlFor="export-type-selection">{t("Export type")}</InputLabel>
                                            <Select
                                                value={this.state.exportType}
                                                onChange={this.handleExportTypeChange}
                                                input={<Input id="export-type-selection" />}
                                                style={styles.selectField}
                                            >
                                                <MenuItem value={"CSV"}>CSV</MenuItem>
                                                <MenuItem value={"MT940"}>MT940</MenuItem>
                                                <MenuItem value={"PDF"}>PDF</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl style={styles.formControl}>
                                            <InputLabel htmlFor="regional-format-selection">
                                                {t("Regional format")}
                                            </InputLabel>
                                            <Select
                                                value={this.state.regionalFormat}
                                                onChange={this.handleRegionalFormatChange}
                                                input={<Input id="regional-format-selection" />}
                                                style={styles.selectField}
                                            >
                                                <MenuItem value={"UK_US"}>UK_US (comma-separated)</MenuItem>
                                                <MenuItem value={"EUROPEAN"}>EUROPEAN (semicolon-separated)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            id="from-date"
                                            label={t("From date")}
                                            emptyLabel="No filter"
                                            format="MMMM dd, YYYY"
                                            disableFuture
                                            style={styles.dateInput}
                                            maxDate={this.state.dateTo}
                                            value={this.state.dateFrom}
                                            onChange={this.handleDateFromChange}
                                            clearable={true}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment style={{ height: 29 }} position="end">
                                                        <IconButton onClick={this.clearDateFrom}>
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
                                            label={t("To date")}
                                            emptyLabel="No filter"
                                            format="MMMM dd, YYYY"
                                            disableFuture
                                            style={styles.dateInput}
                                            minDate={this.state.dateFrom}
                                            value={this.state.dateTo}
                                            onChange={this.handleDateToChange}
                                            clearable={true}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment style={{ height: 29 }} position="end">
                                                        <IconButton onClick={this.clearDateTo}>
                                                            <Icon>clear</Icon>
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TranslateButton
                                            variant="contained"
                                            color="primary"
                                            onClick={this.createNew}
                                            disabled={
                                                this.props.exportNewLoading ||
                                                this.props.exportsLoading ||
                                                this.state.dateFrom === null ||
                                                this.state.dateTo === null
                                            }
                                        >
                                            Create export
                                        </TranslateButton>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper style={styles.paper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={8} md={10}>
                                        <TranslateTypography variant="h5">Existing Exports</TranslateTypography>
                                    </Grid>

                                    <Grid item xs={2} md={1}>
                                        {this.props.exportsLoading ? (
                                            <CircularProgress />
                                        ) : (
                                            <IconButton onClick={this.refreshClick}>
                                                <RefreshIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                    <Grid item xs={2} md={1}>
                                        <IconButton onClick={() => shell.openItem(app.getPath("downloads"))}>
                                            <FolderIcon />
                                        </IconButton>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <List>
                                            {this.props.exportsLoading ? <LinearProgress /> : null}
                                            {exportItems}
                                        </List>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </React.Fragment>
                    ) : null}

                    {this.state.selectedTab === 1 ? (
                        <React.Fragment>
                            <Paper style={styles.paper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <TranslateTypography variant="h5">New custom export</TranslateTypography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            The export will include all the events shown in the list below
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TranslateButton
                                            variant="contained"
                                            color="primary"
                                            onClick={this.createCustomExport}
                                        >
                                            Create export
                                        </TranslateButton>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper>
                                <CombinedList
                                    BunqJSClient={this.props.BunqJSClient}
                                    initialBunqConnect={this.props.initialBunqConnect}
                                    hiddenTypes={[
                                        "BunqMeTab",
                                        "RequestInquiry",
                                        "RequestInquiryBatch",
                                        "RequestResponse",
                                        "ShareInviteBankInquiry"
                                    ]}
                                />
                            </Paper>
                        </React.Fragment>
                    ) : null}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        accountsAccountId: state.accounts.selected_account,

        exportNewLoading: state.export_new.loading,
        exports: state.exports.exports,
        exportsLoading: state.exports.loading,

        searchTerm: state.search_filter.search_term,
        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,

        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle,

        categories: state.categories.categories,
        categoryConnections: state.categories.category_connections,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,
        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        exportInfoUpdate: (userId, accountId) => dispatch(exportInfoUpdate(BunqJSClient, userId, accountId)),
        exportNew: (...params) => dispatch(exportNew(BunqJSClient, ...params))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Exports));

import React from "react";
import { translate } from "react-i18next";
import format from "date-fns/format/index.js";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const remote = require("electron").remote;
const app = remote ? remote.app : {};
import fs from "../../ImportWrappers/fs";
import path from "../../ImportWrappers/path";

import AccountList from "../../Components/AccountList/AccountList";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import CombinedList from "../../Components/CombinedList/CombinedList";

import Logger from "../../Functions/Logger";
import { formatIban } from "../../Functions/Utils";
import { eventFilter } from "../../Functions/DataFilters";
import CategoryHelper from "../../Components/Categories/CategoryHelper";

import { openSnackbar } from "../../Actions/snackbar";

const escapeCsv = val => `"${val.replace('"', '"""')}"`;

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

class CustomExports extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

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

    createCustomExport = () => {
        const events = this.eventMapper();

        console.log(events);

        const sortedEvents = events
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
        sortedEvents.forEach(event => {
            const eventType = event.event.type;
            const info = event.event.object;
            const labels = event.categories.map(category => category.label);

            const description = info.description ? info.description.replace("\n", " ") : "";
            const counterParty = info.counterparty_alias ? info.counterparty_alias : {};
            const alias = info.alias ? info.alias : {};

            console.log(event);

            columnRows.push([
                format(event.date, "yyyy-MM-dd"),
                format(event.date, "HH:mm:ss"),
                info.getDelta(),
                alias.iban ? formatIban(alias.iban) : null,
                counterParty.iban ? formatIban(counterParty.iban) : null,
                counterParty.display_name || "",
                escapeCsv(description),
                labels.join(","),
                info.type || "",
                info.id,
                eventType,
                info.sub_type || "",
                info.authorisation_status || "",
                info.authorisation_type || ""
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
        const startDateLabel = format(dateFromFilter, "yyyy-MM-dd");
        const endDateLabel = format(dateToFilter, "yyyy-MM-dd");
        const fileName = `bunqdesktop-export.${startDateLabel}_${endDateLabel}.csv`;

        // store the file using our custom output
        this.storeFile(resultingCsv, fileName);
    };

    eventMapper = () => {
        return this.props.events
            .filter(event => {
                const filterResult = eventFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,

                    toggleCategoryFilter: this.props.toggleCategoryFilter,
                    selectedCategories: this.props.selectedCategories,

                    selectedAccountIds: this.props.selectedAccountIds,
                    toggleAccountIds: this.props.toggleAccountIds,

                    paymentType: this.props.paymentType,
                    paymentVisibility: this.props.paymentVisibility,
                    bunqMeTabType: this.props.bunqMeTabType,
                    requestType: this.props.requestType,
                    bunqMeTabVisibility: this.props.bunqMeTabVisibility,

                    searchTerm: this.props.searchTerm,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter,
                    amountFilterAmount: this.props.amountFilterAmount,
                    amountFilterType: this.props.amountFilterType
                });

                if (!filterResult) {
                    console.log("Filtered out");
                    console.log(event);
                }

                return filterResult;
            })
            .filter(event => {
                if (!event.isTransaction) {
                    console.log("Not transaction");
                    console.log(event);
                    return false;
                }
                return true;
            })
            .map(event => {
                const categories = CategoryHelper(
                    this.props.categories,
                    this.props.categoryConnections,
                    event.type,
                    event.object.id
                );

                return {
                    date: event.created,
                    event: event,
                    categories: categories
                };
            });
    };

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList BunqJSClient={this.props.BunqJSClient} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
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
                                <TranslateButton variant="contained" color="primary" onClick={this.createCustomExport}>
                                    Create export
                                </TranslateButton>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper>
                        <CombinedList BunqJSClient={this.props.BunqJSClient} onlyTransactions={true} />
                    </Paper>
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

        exports: state.exports.exports,
        exportsLoading: state.exports.loading,

        selectedAccountId: state.accounts.selected_account,

        searchTerm: state.search_filter.search_term,
        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,

        toggleCategoryFilter: state.category_filter.toggle,
        selectedCategories: state.category_filter.selected_categories,

        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle,

        categories: state.categories.categories,
        categoryConnections: state.categories.category_connections,

        events: state.events.events,
        eventsLoading: state.events.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(CustomExports));

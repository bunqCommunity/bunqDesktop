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

        const sortedEvents = events
            .sort(function(a, b) {
                return b.date - a.date;
            })
            .reverse();

        const columnRows = [];
        sortedEvents.forEach(event => {
            const eventType = event.eventType;

            // fallback to event object or use payment event
            const info = event.event.object ? event.event.object : event.event;

            const delta = info.getDelta();
            if (delta === 0) {
                console.log("");
                console.log("Zero delta");
                console.log(event);
                return;
            }

            const labels = event.categories.map(category => category.label);
            const description = info.description ? info.description.replace("\n", " ") : "";
            const counterParty = info.counterparty_alias ? info.counterparty_alias : {};
            const alias = info.alias || info.user_alias_created || {};

            if (!alias || !counterParty || !counterParty.display_name) {
                console.log("");
                console.log("Missing details");
                console.log(alias, counterParty, counterParty.display_name);
                console.log(event);
                console.log(info);
            }

            columnRows.push([
                format(event.date, "dd-MM-yyyy"),
                format(event.date, "HH:mm:ss"),
                delta,
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

        console.log(columnRows);

        // get start and end date
        const dateFromFilter = events[0].date;
        const dateToFilter = events[events.length - 1].date;

        // format a file name
        const startDateLabel = format(dateFromFilter, "yyyy-MM-dd");
        const endDateLabel = format(dateToFilter, "yyyy-MM-dd");
        const fileName = `bunqdesktop-export.${startDateLabel}_${endDateLabel}.csv`;

        // store the file using our custom output
        this.storeFile(resultingCsv, fileName);
    };

    eventMapper = () => {
        const eventFilterHandler = eventFilter({ ...this.props });

        const events = this.props.events
            .filter(event => {
                const result = eventFilterHandler(event);

                if (!result) {
                    console.log("Filtered out");
                    console.log(event);
                }

                return result;
            })
            .filter(event => {
                if (!event.isTransaction) {
                    console.warn("Not transaction");
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
                    // date: event.updated,
                    event: event,
                    eventType: event.type,
                    categories: categories
                };
            });

        const paymentObjectList = [];
        events.forEach(event => {
            const eventInfo = event.event;
            if (!eventInfo.isTransaction) {
                console.warn("Not a transaction");
                return;
            }

            // check for payment objects
            if (eventInfo.paymentObject) {
                paymentObjectList.push({
                    ...event,
                    date: eventInfo.paymentObject.created,
                    event: eventInfo.paymentObject
                });
            } else if (eventInfo.paymentObjects) {
                eventInfo.paymentObjects.forEach(paymentObject => {
                    if (paymentObject) {
                        paymentObjectList.push({
                            ...event,
                            date: paymentObject.updated,
                            event: paymentObject
                        });
                    }
                });
            }
        });

        return paymentObjectList;
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

        events: state.events.events,
        eventsLoading: state.events.loading,

        accountsAccountId: state.accounts.selected_account,
        selectedAccountId: state.accounts.selected_account,

        exports: state.exports.exports,
        exportsLoading: state.exports.loading,

        searchTerm: state.search_filter.search_term,
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,
        generalFilterDate: state.general_filter.date,

        amountFilterAmount: state.amount_filter.amount,
        amountFilterType: state.amount_filter.type,

        selectedCategories: state.category_filter.selected_categories,
        toggleCategoryIds: state.category_filter.toggle,
        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle,
        selectedCardIds: state.card_id_filter.selected_card_ids,
        toggleCardIds: state.card_id_filter.toggle,

        categories: state.categories.categories,
        categoryConnections: state.categories.category_connections,

        registrationReady: state.registration.ready
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

import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import HelpIcon from "@material-ui/icons/Help";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FilterIcon from "@material-ui/icons/FilterList";

import { formatMoney, humanReadableDate, formatIban } from "../Functions/Utils";
import { eventGenericPrimaryText } from "../Functions/EventStatusTexts";

import FilterCreationDialog from "../Components/FilterCreationDialog";
import PDFExportHelper from "../Components/PDFExportHelper/PDFExportHelper";
import SpeedDial from "../Components/SpeedDial";
import ExportDialog from "../Components/ExportDialog";
import CategorySelectorDialog from "../Components/Categories/CategorySelectorDialog";
import CategoryChips from "../Components/Categories/CategoryChips";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";
// import NoteTextForm from "../Components/NoteTexts/NoteTextForm";

import { setTheme } from "../Actions/options";
import { eventInfoUpdate } from "../Actions/event_info";
import { applicationSetPDFMode } from "../Actions/application";

const styles = {
    btn: {},
    paper: {
        padding: 24,
        marginBottom: 16
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class EventInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            displayExport: false,
            displayCategories: false,

            viewFilterCreationDialog: false,

            initialUpdate: false
        };
    }

    componentDidMount() {
        if (this.props.user && this.props.user.id && this.props.registrationReady) {
            const { eventId } = this.props.match.params;
            this.props.eventInfoUpdate(this.props.user.id, eventId);
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.registrationReady &&
            this.props.match.params.eventId !== nextProps.match.params.eventId
        ) {
            const { eventId } = this.props.match.params;
            this.props.eventInfoUpdate(this.props.user.id, eventId);
            this.setState({ initialUpdate: true });
        }
        return null;
    }
    componentDidUpdate() {}

    toggleCategoryDialog = event => this.setState({ displayCategories: !this.state.displayCategories });
    toggleCreateFilterDialog = e => {
        this.setState({
            viewFilterCreationDialog: !this.state.viewFilterCreationDialog
        });
    };
    createPdfExport = () => {
        const { eventInfo } = this.props;

        // enable pdf mode
        this.props.applicationSetPDFMode(true);

        // format a file name
        const timeStamp = eventInfo.created.getTime();
        const fileName = `event-${eventInfo.id}-${timeStamp}.pdf`;

        // delay for a short period to let the application update and then create a pdf
        setTimeout(() => {
            ipcRenderer.send("print-to-pdf", fileName);
        }, 100);
    };

    onRequest = e => {
        this.props.history.push(`/request?amount=${this.props.eventInfo.getAmount()}`);
    };
    onForward = e => {
        this.props.history.push(`/pay?amount=${this.props.eventInfo.getAmount()}`);
    };

    render() {
        const { eventInfo, eventLoading, pdfSaveModeEnabled, t } = this.props;

        let content;
        let noteTextsForm = null;
        if (eventInfo === false || eventLoading === true || this.state.initialUpdate === false) {
            content = (
                <Grid container spacing={24} justify={"center"}>
                    <Grid item xs={12}>
                        <div style={{ textAlign: "center" }}>
                            <CircularProgress />
                        </div>
                    </Grid>
                </Grid>
            );
        } else {
            const eventObject = eventInfo.object;
            const eventDescription = eventGenericPrimaryText(eventInfo, t);
            const eventDate = humanReadableDate(eventObject.updated);
            const eventAmount = parseFloat(eventObject.getAmount());
            const formattedEventAmount = formatMoney(eventAmount, true);
            let counterPartyIban = null;
            const eventPayment = eventObject.paymentObject;

            // noteTextsForm = <NoteTextForm BunqJSClient={this.props.BunqJSClient} event={event} />;

            let headerComponent = null;
            if (eventPayment) {
                const personalAlias = eventPayment.alias;
                const counterPartyAlias = eventPayment.counterparty_alias;
                counterPartyIban = counterPartyAlias ? counterPartyAlias.iban : null;

                // pdf export for the underlying payment
                if (pdfSaveModeEnabled && personalAlias && counterPartyAlias) {
                    return (
                        <PDFExportHelper
                            t={t}
                            payment={eventPayment}
                            formattedPaymentAmount={formattedEventAmount}
                            eventDate={eventDate}
                            personalAlias={personalAlias}
                            counterPartyAlias={counterPartyAlias}
                        />
                    );
                }

                if (eventObject.isTransaction && personalAlias && counterPartyAlias) {
                    const transactionHeaderProps = {
                        BunqJSClient: this.props.BunqJSClient,
                        user: this.props.user,
                        accounts: this.props.accounts,
                        to: counterPartyAlias,
                        from: personalAlias,
                        swap: eventAmount > 0,
                        type: "event",
                        onForwardColor: "secondary",
                        event: eventObject.object,
                        transferAmountComponent: (
                            <MoneyAmountLabel
                                component={"h1"}
                                style={{ textAlign: "center" }}
                                info={eventObject}
                                type="event"
                            >
                                {formattedEventAmount}
                            </MoneyAmountLabel>
                        )
                    };
                    if (eventObject.getDelta() < 0) {
                        transactionHeaderProps.onRequest = this.onRequest;
                    } else {
                        transactionHeaderProps.onForward = this.onForward;
                    }
                    headerComponent = <TransactionHeader key="transaction-header" {...transactionHeaderProps} />;
                }
            }

            content = (
                <Grid container spacing={24} align={"center"} justify={"center"}>
                    {headerComponent}

                    <FilterCreationDialog
                        t={t}
                        item={eventInfo}
                        open={this.state.viewFilterCreationDialog}
                        onClose={this.toggleCreateFilterDialog}
                    />

                    <Grid item xs={12}>
                        <List style={styles.list}>
                            {eventDescription && eventDescription.length > 0 ? (
                                <React.Fragment>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Description")} secondary={eventDescription} />
                                    </ListItem>
                                </React.Fragment>
                            ) : null}

                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Date")} secondary={eventDate} />
                            </ListItem>

                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Event Type")} secondary={eventInfo.type} />
                            </ListItem>

                            {counterPartyIban && (
                                <React.Fragment>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={"IBAN"} secondary={formatIban(counterPartyIban)} />
                                    </ListItem>
                                </React.Fragment>
                            )}

                            <Divider />
                        </List>

                        <CategoryChips type="Event" id={eventInfo.id} />

                        <CategorySelectorDialog
                            type={eventInfo.type}
                            item={eventInfo}
                            onClose={this.toggleCategoryDialog}
                            open={this.state.displayCategories}
                        />

                        <SpeedDial
                            actions={[
                                {
                                    name: t("Create PDF"),
                                    icon: SaveIcon,
                                    color: "action",
                                    onClick: this.createPdfExport
                                },
                                {
                                    name: t("Create filter"),
                                    icon: FilterIcon,
                                    color: "action",
                                    onClick: this.toggleCreateFilterDialog
                                },
                                {
                                    name: t("Manage categories"),
                                    icon: BookmarkIcon,
                                    color: "action",
                                    onClick: this.toggleCategoryDialog
                                },
                                {
                                    name: t("View debug information"),
                                    icon: HelpIcon,
                                    color: "action",
                                    onClick: () =>
                                        this.setState({
                                            displayExport: true
                                        })
                                }
                            ]}
                        />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.eventInfo && this.props.eventInfo._rawData ? this.props.eventInfo._rawData.Event : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Event Info")}`}</title>
                </Helmet>

                <ExportDialog
                    closeModal={() => this.setState({ displayExport: false })}
                    title={t("Export info")}
                    open={this.state.displayExport}
                    object={exportData}
                />

                <Grid item xs={12} sm={2} lg={3}>
                    <Button onClick={this.props.history.goBack} style={styles.btn}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} lg={6}>
                    <Paper style={styles.paper}>{content}</Paper>

                    {noteTextsForm}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled,

        eventInfo: state.event_info.event,
        eventLoading: state.event_info.loading,

        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        applicationSetPDFMode: enabled => dispatch(applicationSetPDFMode(enabled)),

        eventInfoUpdate: (user_id, account_id, event_id) =>
            dispatch(eventInfoUpdate(BunqJSClient, user_id, account_id, event_id)),

        setTheme: theme => dispatch(setTheme(theme))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(EventInfo));

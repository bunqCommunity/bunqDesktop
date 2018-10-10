import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import HelpIcon from "@material-ui/icons/Help";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FilterIcon from "@material-ui/icons/FilterList";

import { formatMoney, humanReadableDate, formatIban } from "../Helpers/Utils";
import { paymentText, paymentTypeParser } from "../Helpers/StatusTexts";

import FilterCreationDialog from "../Components/FilterCreationDialog";
import GeoLocationListItem from "../Components/GeoLocation/GeoLocationListItem";
import PDFExportHelper from "../Components/PDFExportHelper";
import SpeedDial from "../Components/SpeedDial";
import ExportDialog from "../Components/ExportDialog";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";
import CategorySelectorDialog from "../Components/Categories/CategorySelectorDialog";
import CategoryChips from "../Components/Categories/CategoryChips";
import NoteTextForm from "../Components/NoteTexts/NoteTextForm";

import { setTheme } from "../Actions/options";
import { paymentsUpdate } from "../Actions/payment_info";
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

class PaymentInfo extends React.Component {
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
        if (this.props.user && this.props.user.id && this.props.initialBunqConnect) {
            const { paymentId, accountId } = this.props.match.params;
            this.props.updatePayment(
                this.props.user.id,
                accountId === undefined ? this.props.accountsSelectedAccount : accountId,
                paymentId
            );
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.initialBunqConnect &&
            this.props.match.params.paymentId !== nextProps.match.params.paymentId
        ) {
            const { paymentId, accountId } = this.props.match.params;
            this.props.updatePayment(
                this.props.user.id,
                accountId === undefined ? this.props.accountsSelectedAccount : accountId,
                paymentId
            );
            this.setState({ initialUpdate: true });
        }
        return null;
    }
    componentDidUpdate() {}

    toggleCategoryDialog = event => this.setState({ displayCategories: !this.state.displayCategories });

    startPaymentIban = alias => {
        this.props.history.push(`/pay?iban=${alias.iban}&iban-name=${alias.display_name}`);
    };
    startPayment = event => {
        const paymentInfo = this.props.paymentInfo;
        this.props.history.push(`/pay?amount=${paymentInfo.getAmount()}`);
    };
    startRequest = event => {
        const paymentInfo = this.props.paymentInfo;
        this.props.history.push(`/request?amount=${paymentInfo.getAmount()}`);
    };
    toggleCreateFilterDialog = e => {
        this.setState({
            viewFilterCreationDialog: !this.state.viewFilterCreationDialog
        });
    };

    createPdfExport = () => {
        const { paymentInfo } = this.props;

        // enable pdf mode
        this.props.applicationSetPDFMode(true);

        // format a file name
        const timeStamp = paymentInfo.created.getTime();
        const fileName = `payment-${paymentInfo.id}-${timeStamp}.pdf`;

        // delay for a short period to let the application update and then create a pdf
        setTimeout(() => {
            ipcRenderer.send("print-to-pdf", fileName);
        }, 100);
    };

    render() {
        const { accountsSelectedAccount, paymentInfo, paymentLoading, pdfSaveModeEnabled, t } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        let noteTextsForm = null;
        if (paymentInfo === false || paymentLoading === true || this.state.initialUpdate === false) {
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
            const payment = paymentInfo.Payment;
            const paymentDescription = payment.description;
            const paymentDate = humanReadableDate(payment.updated);
            const paymentAmount = parseFloat(payment.amount.value);
            const formattedPaymentAmount = formatMoney(paymentAmount, true);
            const paymentLabel = paymentText(payment, t);
            const personalAlias = payment.alias;
            const counterPartyAlias = payment.counterparty_alias;
            const counterPartyIban = payment.counterparty_alias.iban;

            if (pdfSaveModeEnabled) {
                return (
                    <PDFExportHelper
                        t={t}
                        payment={payment}
                        formattedPaymentAmount={formattedPaymentAmount}
                        paymentDate={paymentDate}
                        personalAlias={personalAlias}
                        counterPartyAlias={counterPartyAlias}
                    />
                );
            }

            noteTextsForm = <NoteTextForm BunqJSClient={this.props.BunqJSClient} event={payment} />;

            content = (
                <Grid container spacing={24} align={"center"} justify={"center"}>
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={payment.counterparty_alias}
                        from={payment.alias}
                        user={this.props.user}
                        accounts={this.props.accounts}
                        startPaymentIban={this.startPaymentIban}
                        swap={paymentAmount > 0}
                        type="payment"
                        event={payment}
                    />

                    <FilterCreationDialog
                        t={t}
                        item={payment}
                        open={this.state.viewFilterCreationDialog}
                        onClose={this.toggleCreateFilterDialog}
                    />

                    <Grid item xs={12}>
                        <MoneyAmountLabel
                            component={"h1"}
                            style={{ textAlign: "center" }}
                            info={payment}
                            type="payment"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>

                        <Typography style={{ textAlign: "center" }} variant="body2">
                            {paymentLabel}
                        </Typography>

                        <List style={styles.list}>
                            {paymentDescription.length > 0 ? (
                                <React.Fragment>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Description")} secondary={paymentDescription} />
                                    </ListItem>
                                </React.Fragment>
                            ) : null}

                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Date")} secondary={paymentDate} />
                            </ListItem>

                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Payment Type")}
                                    secondary={paymentTypeParser(payment.type, t)}
                                />
                            </ListItem>

                            <Divider />
                            <ListItem>
                                <ListItemText primary={"IBAN"} secondary={formatIban(counterPartyIban)} />
                            </ListItem>

                            <Divider />
                            <GeoLocationListItem t={t} geoLocation={paymentInfo.geolocation} />
                        </List>

                        <CategoryChips type={"Payment"} id={payment.id} />

                        <CategorySelectorDialog
                            type={"Payment"}
                            item={paymentInfo}
                            onClose={this.toggleCategoryDialog}
                            open={this.state.displayCategories}
                        />

                        <SpeedDial
                            hidden={false}
                            actions={[
                                {
                                    name: t("Send payment"),
                                    icon: ArrowUpIcon,
                                    color: "action",
                                    onClick: this.startPayment
                                },
                                {
                                    name: t("Send request"),
                                    icon: ArrowDownIcon,
                                    color: "action",
                                    onClick: this.startRequest
                                },
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
                                    onClick: event =>
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
            this.props.paymentInfo && this.props.paymentInfo._rawData ? this.props.paymentInfo._rawData.Payment : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Payment Info")}`}</title>
                </Helmet>

                <ExportDialog
                    closeModal={event => this.setState({ displayExport: false })}
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

        paymentInfo: state.payment_info.payment,
        paymentLoading: state.payment_info.loading,

        accountsSelectedAccount: state.accounts.selected_account,
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        applicationSetPDFMode: enabled => dispatch(applicationSetPDFMode(enabled)),

        updatePayment: (user_id, account_id, payment_id) =>
            dispatch(paymentsUpdate(BunqJSClient, user_id, account_id, payment_id)),

        setTheme: theme => dispatch(setTheme(theme))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(PaymentInfo));

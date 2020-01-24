import React, { CSSProperties } from "react";
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

import { formatMoney, humanReadableDate, formatIban } from "~functions/Utils";
import { paymentText, paymentTypeParser } from "~functions/EventStatusTexts";

import FilterCreationDialog from "~components/FilterCreationDialog";
import GeoLocationListItem from "~components/GeoLocation/GeoLocationListItem";
import PDFExportHelper from "~components/PDFExportHelper/PDFExportHelper";
import SpeedDial from "~components/SpeedDial";
import ExportDialog from "~components/ExportDialog";
import MoneyAmountLabel from "~components/MoneyAmountLabel";
import TransactionHeader from "~components/TransactionHeader";
import CategorySelectorDialog from "~components/Categories/CategorySelectorDialog";
import CategoryChips from "~components/Categories/CategoryChips";
import NoteTextForm from "~components/NoteTexts/NoteTextForm";

import { setTheme } from "~actions/options";
import { paymentsUpdate } from "~actions/payment_info";
import { actions as applicationActions } from "~store/application";
import { AppDispatch, ReduxState } from "~store/index";

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

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class PaymentInfo extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

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
            const { paymentId, accountId } = this.props.match.params;
            this.props.updatePayment(this.props.user.id, accountId, paymentId);
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.registrationReady &&
            this.props.match.params.paymentId !== nextProps.match.params.paymentId
        ) {
            const { paymentId, accountId } = this.props.match.params;
            this.props.updatePayment(this.props.user.id, accountId, paymentId);
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

    onRequest = e => {
        this.props.history.push(`/request?amount=${this.props.paymentInfo.getAmount()}`);
    };
    onForward = e => {
        this.props.history.push(`/pay?amount=${this.props.paymentInfo.getAmount()}`);
    };

    render() {
        const { paymentInfo, paymentLoading, pdfSaveModeEnabled, t } = this.props;

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

            noteTextsForm = <NoteTextForm event={payment} />;

            const transactionHeaderProps = {
                to: payment.counterparty_alias,
                from: payment.alias,
                user: this.props.user,
                accounts: this.props.accounts,
                swap: paymentAmount > 0,
                type: "payment",
                onForwardColor: "secondary",
                event: payment,
                transferAmountComponent: (
                    <MoneyAmountLabel component={"h1"} style={{ textAlign: "center" }} info={payment} type="payment">
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                )
            };
            if (paymentInfo.getDelta() < 0) {
                // @ts-ignore
                transactionHeaderProps.onRequest = this.onRequest;
            } else {
                // @ts-ignore
                transactionHeaderProps.onForward = this.onForward;
            }

            content = (
                // @ts-ignore
                <Grid container spacing={24} align={"center"} justify={"center"}>
                    <TransactionHeader {...transactionHeaderProps} />

                    <FilterCreationDialog
                        t={t}
                        item={payment}
                        open={this.state.viewFilterCreationDialog}
                        onClose={this.toggleCreateFilterDialog}
                    />

                    <Grid item xs={12}>
                        <List style={styles.list as CSSProperties}>
                            <Divider />
                            <ListItem>
                                <ListItemText primary={paymentLabel} />
                            </ListItem>

                            {paymentDescription && paymentDescription.length > 0 ? (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Description")} secondary={paymentDescription} />
                                    </ListItem>
                                </>
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

                            {counterPartyIban && counterPartyIban.length > 0 ? (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={"IBAN"} secondary={formatIban(counterPartyIban)} />
                                    </ListItem>
                                </>
                            ) : null}

                            <Divider />
                            <GeoLocationListItem geoLocation={paymentInfo.geolocation} />
                        </List>

                        <CategoryChips type={"Payment"} id={payment.id} />

                        <CategorySelectorDialog
                            type={"Payment"}
                            item={paymentInfo}
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

const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user.user,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled,

        paymentInfo: state.payment_info.payment,
        paymentLoading: state.payment_info.loading,

        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        applicationSetPDFMode: enabled => dispatch(applicationActions.setPdfMode(enabled)),

        updatePayment: (user_id, account_id, payment_id) =>
            dispatch(paymentsUpdate(user_id, account_id, payment_id)),

        setTheme: theme => dispatch(setTheme(theme))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(PaymentInfo));

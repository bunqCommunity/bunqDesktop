import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withTheme } from "@material-ui/core/styles";
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

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/Help";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import SaveIcon from "@material-ui/icons/Save";
import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";
import FilterIcon from "@material-ui/icons/FilterList";

import FilterCreationDialog from "../Components/FilterCreationDialog";
import PDFExportHelper from "../Components/PDFExportHelper";
import ExportDialog from "../Components/ExportDialog";
import SpeedDial from "../Components/SpeedDial";
import TransactionHeader from "../Components/TransactionHeader";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import CategorySelectorDialog from "../Components/Categories/CategorySelectorDialog";
import CategoryChips from "../Components/Categories/CategoryChips";
import NoteTextForm from "../Components/NoteTexts/NoteTextForm";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import { masterCardActionText, masterCardActionParser } from "../Helpers/StatusTexts";
import { masterCardActionInfoUpdate } from "../Actions/master_card_action_info";
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

class MasterCardActionInfo extends React.Component {
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
        if (this.props.initialBunqConnect && this.props.user && this.props.user.id) {
            const { masterCardActionId, accountId } = this.props.match.params;
            this.props.masterCardActionInfoUpdate(
                this.props.user.id,
                accountId === undefined ? this.props.accountsSelectedAccount : accountId,
                masterCardActionId
            );
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.initialBunqConnect &&
            this.props.match.params.masterCardActionId !== this.props.match.params.masterCardActionId
        ) {
            const { masterCardActionId, accountId } = this.props.match.params;
            this.props.masterCardActionInfoUpdate(
                this.props.user.id,
                accountId === undefined ? this.props.accountsSelectedAccount : accountId,
                masterCardActionId
            );
            this.setState({ initialUpdate: true });
        }
        return null;
    }
    componentDidUpdate() {}

    toggleCategoryDialog = event => this.setState({ displayCategories: !this.state.displayCategories });
    startPayment = event => {
        const paymentInfo = this.props.masterCardActionInfo;
        this.props.history.push(`/pay?amount=${paymentInfo.getAmount()}`);
    };
    startRequest = event => {
        const paymentInfo = this.props.masterCardActionInfo;
        this.props.history.push(`/request?amount=${paymentInfo.getAmount()}`);
    };
    toggleCreateFilterDialog = e => {
        this.setState({
            viewFilterCreationDialog: !this.state.viewFilterCreationDialog
        });
    };

    createPdfExport = () => {
        const { masterCardActionInfo } = this.props;

        // enable pdf mode
        this.props.applicationSetPDFMode(true);

        // format a file name
        const timeStamp = masterCardActionInfo.updated.getTime();
        const fileName = `card-payment-${masterCardActionInfo.id}-${timeStamp}.pdf`;

        // delay for a short period to let the application update and then create a pdf
        setTimeout(() => {
            ipcRenderer.send("print-to-pdf", fileName);
        }, 250);
    };

    render() {
        const { accountsSelectedAccount, masterCardActionInfo, masterCardActionLoading, theme, t } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        let noteTextsForm = null;
        if (masterCardActionInfo === false || masterCardActionLoading === true || this.state.initialUpdate === false) {
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
            const masterCardAction = masterCardActionInfo;
            let paymentAmount = masterCardAction.getAmount();
            paymentAmount = paymentAmount > 0 ? paymentAmount * -1 : paymentAmount;
            const paymentDate = humanReadableDate(masterCardAction.created);
            const paymentDateUpdated = humanReadableDate(masterCardAction.updated);
            const formattedPaymentAmount = formatMoney(paymentAmount, true);
            const paymentLabel = masterCardActionText(masterCardAction, t);

            if (this.props.pdfSaveModeEnabled) {
                return (
                    <PDFExportHelper
                        t={t}
                        payment={masterCardAction}
                        formattedPaymentAmount={formattedPaymentAmount}
                        paymentDate={paymentDate}
                        paymentDateUpdated={paymentDateUpdated}
                        personalAlias={masterCardAction.alias}
                        counterPartyAlias={masterCardAction.counterparty_alias}
                    />
                );
            }

            noteTextsForm = <NoteTextForm BunqJSClient={this.props.BunqJSClient} event={masterCardAction} />;

            content = (
                <Grid container spacing={24} align={"center"} justify={"center"}>
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={masterCardAction.counterparty_alias}
                        from={masterCardAction.alias}
                        accounts={this.props.accounts}
                        user={this.props.user}
                        type="masterCardAction"
                        event={masterCardAction}
                    />

                    <FilterCreationDialog
                        t={t}
                        item={masterCardAction}
                        open={this.state.viewFilterCreationDialog}
                        onClose={this.toggleCreateFilterDialog}
                    />

                    <Grid item xs={12}>
                        <MoneyAmountLabel
                            component={"h1"}
                            style={{ textAlign: "center" }}
                            info={masterCardAction}
                            type="masterCardAction"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>

                        <Typography style={{ textAlign: "center" }} variant={"body1"}>
                            {paymentLabel}
                        </Typography>

                        <List style={styles.list}>
                            {masterCardAction.description.length > 0
                                ? [
                                      <Divider />,
                                      <ListItem>
                                          <ListItemText
                                              primary={t("Description")}
                                              secondary={masterCardAction.description}
                                          />
                                      </ListItem>
                                  ]
                                : null}

                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Date")} secondary={paymentDate} />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Payment Type")}
                                    secondary={masterCardActionParser(masterCardAction, t)}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Card")} secondary={masterCardAction.label_card.second_line} />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Authorisation Type")}
                                    secondary={masterCardAction.authorisation_type}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Authorisation Status")}
                                    secondary={masterCardAction.authorisation_status}
                                />
                            </ListItem>
                            <Divider />
                        </List>

                        <CategoryChips type={"MasterCardAction"} id={masterCardActionInfo.id} />

                        <CategorySelectorDialog
                            type={"MasterCardAction"}
                            item={masterCardActionInfo}
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
                                    name: t("Create filter"),
                                    icon: FilterIcon,
                                    color: "action",
                                    onClick: this.toggleCreateFilterDialog
                                },
                                {
                                    name: t("Create PDF"),
                                    icon: SaveIcon,
                                    color: "action",
                                    onClick: this.createPdfExport
                                },
                                {
                                    name: t("Manage categories"),
                                    icon: BookmarkIcon,
                                    onClick: this.toggleCategoryDialog
                                },
                                {
                                    name: t("View debug information"),
                                    icon: HelpIcon,
                                    onClick: event => this.setState({ displayExport: true })
                                }
                            ]}
                        />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.masterCardActionInfo && this.props.masterCardActionInfo._rawData
                ? this.props.masterCardActionInfo._rawData.MasterCardAction
                : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Mastercard Info")}`}</title>
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

        masterCardActionInfo: state.master_card_action_info.master_card_action_info,
        masterCardActionLoading: state.master_card_action_info.loading,

        accounts: state.accounts.accounts,
        accountsSelectedAccount: state.accounts.selected_account
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        applicationSetPDFMode: enabled => dispatch(applicationSetPDFMode(enabled)),

        masterCardActionInfoUpdate: (user_id, account_id, master_card_action_id) =>
            dispatch(masterCardActionInfoUpdate(BunqJSClient, user_id, account_id, master_card_action_id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme()(translate("translations")(MasterCardActionInfo)));

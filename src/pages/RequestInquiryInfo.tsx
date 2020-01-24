import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

import CopyIcon from "@material-ui/icons/FileCopy";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/Help";
import SaveIcon from "@material-ui/icons/Save";
import FilterIcon from "@material-ui/icons/FilterList";

import FilterCreationDialog from "~components/FilterCreationDialog";
import ExportDialog from "~components/ExportDialog";
import PDFExportHelper from "~components/PDFExportHelper/PDFExportHelper";
import SpeedDial from "~components/SpeedDial";
import TranslateButton from "~components/TranslationHelpers/Button";
import MoneyAmountLabel from "~components/MoneyAmountLabel";
import TransactionHeader from "~components/TransactionHeader";
import CategorySelector from "~components/Categories/CategorySelector";
import NoteTextForm from "~components/NoteTexts/NoteTextForm";
import CopyToClipboardWrap from "~components/CopyToClipboardWrap";

import { formatMoney, humanReadableDate } from "~functions/Utils";
import { requestInquiryText } from "~functions/EventStatusTexts";
import { requestInquiryCancel } from "~actions/request_inquiry";
import { requestInquiryUpdate } from "~actions/request_inquiry_info";
import { actions as applicationActions } from "~store/application";
import { AppDispatch, ReduxState } from "~store/index";

const styles = {
    btn: {},
    button: {
        width: "100%"
    },
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

class RequestInquiryInfo extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {
            displayExport: false,

            viewFilterCreationDialog: false,

            initialUpdate: false
        };
    }

    componentDidMount() {
        if (this.props.registrationReady) {
            const { requestInquiryId, accountId } = this.props.match.params;
            this.props.requestInquiryUpdate(this.props.user.id, accountId, requestInquiryId);
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.registrationReady &&
            this.props.match.params.requestInquiryId !== this.props.match.params.requestInquiryId
        ) {
            const { requestInquiryId, accountId } = this.props.match.params;
            this.props.requestInquiryUpdate(this.props.user.id, accountId, requestInquiryId);
            this.setState({ initialUpdate: true });
        }
        return null;
    }
    componentDidUpdate() {}

    cancelInquiry = () => {
        const { requestInquiryId, accountId } = this.props.match.params;
        this.props.requestInquiryCancel(this.props.user.id, accountId, requestInquiryId);
    };

    createPdfExport = () => {
        const { requestInquiryInfo } = this.props;

        // enable pdf mode
        this.props.applicationSetPDFMode(true);

        // format a file name
        const timeStamp = requestInquiryInfo.created.getTime();
        const fileName = `request-${requestInquiryInfo.id}-${timeStamp}.pdf`;

        // delay for a short period to let the application update and then create a pdf
        setTimeout(() => {
            ipcRenderer.send("print-to-pdf", fileName);
        }, 250);
    };
    toggleCreateFilterDialog = e => {
        this.setState({
            viewFilterCreationDialog: !this.state.viewFilterCreationDialog
        });
    };

    onRepeat = e => {
        this.props.history.push(`/request?amount=${this.props.requestInquiryInfo.getAmount()}`);
    };
    onForward = e => {
        this.props.history.push(`/pay?amount=${this.props.requestInquiryInfo.getAmount()}`);
    };

    render() {
        const {
            limitedPermissions,
            requestInquiryInfo,
            requestInquiryLoading,
            requestInquiryInfoLoading,
            t
        } = this.props;

        let content;
        let noteTextsForm = null;
        if (requestInquiryInfo === false || requestInquiryInfoLoading === true || this.state.initialUpdate === false) {
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
            const requestInquiry = requestInquiryInfo.RequestInquiry;
            const paymentDateCreated = humanReadableDate(requestInquiry.created);
            const paymentDate = humanReadableDate(requestInquiry.updated);
            const paymentAmount = requestInquiry.amount_inquired.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const requestInquiryLabel = requestInquiryText(requestInquiry, t);

            if (this.props.pdfSaveModeEnabled) {
                return (
                    <PDFExportHelper
                        t={t}
                        payment={requestInquiry}
                        formattedPaymentAmount={formattedPaymentAmount}
                        paymentDate={paymentDateCreated}
                        paymentDateUpdated={paymentDate}
                        personalAlias={requestInquiry.alias}
                        counterPartyAlias={requestInquiry.counterparty_alias}
                    />
                );
            }

            noteTextsForm = <NoteTextForm event={requestInquiry} />;

            const transactionHeaderProps = {
                to: requestInquiry.counterparty_alias,
                from: requestInquiry.user_alias_created,
                onForwardColor: "secondary",
                user: this.props.user,
                transferAmountComponent: (
                    <MoneyAmountLabel
                        component={"h1"}
                        style={{ textAlign: "center" }}
                        info={requestInquiry}
                        type="requestInquiry"
                    >
                        {formattedPaymentAmount}
                    </MoneyAmountLabel>
                )
            };
            if (requestInquiryInfo.getDelta() > 0) {
                transactionHeaderProps.onRepeat = this.onRepeat;
                transactionHeaderProps.onForward = this.onForward;
            }
            content = (
                <Grid container spacing={24} align={"center"} justify={"center"}>
                    <TransactionHeader {...transactionHeaderProps} />

                    <FilterCreationDialog
                        t={t}
                        item={requestInquiry}
                        open={this.state.viewFilterCreationDialog}
                        onClose={this.toggleCreateFilterDialog}
                    />

                    <Grid item xs={12}>
                        <List style={styles.list}>
                            <Divider />
                            <ListItem>
                                <ListItemText primary={requestInquiryLabel} />
                            </ListItem>

                            {requestInquiry.description.length > 0
                                ? [
                                      <Divider />,
                                      <ListItem>
                                          <ListItemText
                                              primary={"Description"}
                                              secondary={requestInquiry.description}
                                          />
                                      </ListItem>
                                  ]
                                : null}

                            <Divider />
                            <ListItem>
                                <ListItemText primary={t("Date")} secondary={paymentDate} />
                            </ListItem>
                            {requestInquiry.bunqme_share_url ? (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={"bunq.me Url"}
                                            secondary={requestInquiry.bunqme_share_url}
                                        />
                                        <ListItemSecondaryAction>
                                            <CopyToClipboardWrap text={requestInquiry.bunqme_share_url}>
                                                <IconButton>
                                                    <CopyIcon />
                                                </IconButton>
                                            </CopyToClipboardWrap>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </>
                            ) : null}
                            {requestInquiry.counterparty_alias.iban ? (
                                <>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={"IBAN"}
                                            secondary={requestInquiry.counterparty_alias.iban}
                                        />
                                    </ListItem>
                                </>
                            ) : null}
                            <Divider />
                        </List>

                        {!limitedPermissions && requestInquiry.status === "PENDING" ? (
                            <Grid container spacing={16} justify="center">
                                <Grid item xs={12} sm={6}>
                                    <TranslateButton
                                        variant="contained"
                                        disabled={requestInquiryLoading || requestInquiryInfoLoading}
                                        onClick={this.cancelInquiry}
                                        color="secondary"
                                        style={styles.button}
                                    >
                                        Cancel
                                    </TranslateButton>
                                </Grid>
                            </Grid>
                        ) : null}

                        <CategorySelector type={"RequestInquiry"} item={requestInquiryInfo} />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.requestInquiryInfo && this.props.requestInquiryInfo._rawData
                ? this.props.requestInquiryInfo._rawData.RequestInquiry
                : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Request Info")}`}</title>
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

                <SpeedDial
                    actions={[
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
                            name: t("View debug information"),
                            icon: HelpIcon,
                            onClick: event => this.setState({ displayExport: true })
                        }
                    ]}
                />
            </Grid>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        requestInquiryInfo: state.request_inquiry_info.request_inquiry_info,
        requestInquiryInfoLoading: state.request_inquiry_info.loading,

        requestInquiryLoading: state.request_inquiry.loading,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        applicationSetPDFMode: enabled => dispatch(applicationActions.setPdfMode(enabled)),

        requestInquiryUpdate: (user_id, account_id, request_inquiry_id) =>
            dispatch(requestInquiryUpdate(user_id, account_id, request_inquiry_id)),
        requestInquiryCancel: (user_id, account_id, request_inquiry_id) =>
            dispatch(requestInquiryCancel(user_id, account_id, request_inquiry_id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(RequestInquiryInfo));

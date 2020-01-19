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
import HelpIcon from "@material-ui/icons/Help";
import SaveIcon from "@material-ui/icons/Save";
import FilterIcon from "@material-ui/icons/FilterList";

import FilterCreationDialog from "../../Components/FilterCreationDialog";
import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import PDFExportHelper from "../../Components/PDFExportHelper/PDFExportHelper";
import ExportDialog from "../../Components/ExportDialog";
import SpeedDial from "../../Components/SpeedDial";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import MoneyAmountLabel from "../../Components/MoneyAmountLabel";
import TransactionHeader from "../../Components/TransactionHeader";
import CategorySelector from "../../Components/Categories/CategorySelector";
import NoteTextForm from "../../Components/NoteTexts/NoteTextForm";
import GeoLocationListItem from "../../Components/GeoLocation/GeoLocationListItem";

import { formatMoney, humanReadableDate } from "../../Functions/Utils";
import { requestResponseText, requestResponseTypeParser } from "../../Functions/EventStatusTexts";

import { requestResponseUpdate } from "../../Actions/request_response_info";
import { requestResponseReject, requestResponseAccept } from "../../Actions/request_response";
import { applicationSetPDFMode } from "../../Actions/application";

const styles = {
    btn: {},
    button: {
        width: "100%"
    },
    paper: {
        padding: 24,
        marginBottom: 12
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class RequestResponseInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            accepted: false,
            displayExport: false,

            selectedAccount: 0,

            viewFilterCreationDialog: false,

            initialUpdate: false
        };
    }

    componentDidMount() {
        if (this.props.registrationReady) {
            const { requestResponseId, accountId } = this.props.match.params;
            this.props.requestResponseUpdate(this.props.user.id, accountId, requestResponseId);
            this.setState({ initialUpdate: true });
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.registrationReady &&
            this.props.match.params.requestResponseId !== this.props.match.params.requestResponseId
        ) {
            const { requestResponseId, accountId } = this.props.match.params;
            this.props.requestResponseUpdate(this.props.user.id, accountId, requestResponseId);
            this.setState({ initialUpdate: true });
        }
        return null;
    }
    componentDidUpdate() {}

    toggleCreateFilterDialog = e => {
        this.setState({
            viewFilterCreationDialog: !this.state.viewFilterCreationDialog
        });
    };

    rejectRequest = () => {
        const { requestResponseId, accountId } = this.props.match.params;
        this.props.requestResponseReject(this.props.user.id, accountId, requestResponseId);
    };

    acceptRequest = () => {
        const { requestResponseId } = this.props.match.params;
        const { user, requestResponseInfo } = this.props;

        const requestResponse = requestResponseInfo.RequestResponse;

        const options = {};

        // get account that is selected
        const accountInfo = this.props.accounts[this.state.selectedAccount];

        this.props.requestResponseAccept(
            user.id,
            accountInfo.id,
            requestResponseId,
            requestResponse.amount_inquired,
            options
        );
    };

    createPdfExport = () => {
        const { requestResponseInfo } = this.props;

        // enable pdf mode
        this.props.applicationSetPDFMode(true);

        // format a file name
        const timeStamp = requestResponseInfo.created.getTime();
        const fileName = `request-${requestResponseInfo.id}-${timeStamp}.pdf`;

        // delay for a short period to let the application update and then create a pdf
        setTimeout(() => {
            ipcRenderer.send("print-to-pdf", fileName);
        }, 250);
    };

    handleChangeDirect = name => value => {
        this.setState({
            [name]: value
        });
    };

    onRequest = e => {
        const { requestResponseInfo } = this.props;
        this.props.history.push(`/request?amount=${requestResponseInfo.getAmount()}`);
    };

    render() {
        const {
            t,
            requestResponseInfo,
            requestResponseInfoLoading,
            requestResponseLoading,
            limitedPermissions,
            accounts
        } = this.props;

        let content;
        let noteTextsForm = null;
        if (
            requestResponseInfo === false ||
            requestResponseInfoLoading === true ||
            this.state.initialUpdate === false
        ) {
            content = (
                <Paper style={styles.paper}>
                    <Grid container spacing={24} justify={"center"}>
                        <Grid item xs={12}>
                            <div style={{ textAlign: "center" }}>
                                <CircularProgress />
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            );
        } else {
            const requestResponse = requestResponseInfo.RequestResponse;
            const createdDate = humanReadableDate(requestResponse.created);
            const timeRespondedDate = requestResponse.time_responded
                ? humanReadableDate(requestResponse.time_responded)
                : false;
            let paymentAmount = requestResponse.amount_inquired.value;
            paymentAmount = requestResponse.status === "ACCEPTED" ? paymentAmount * -1 : paymentAmount;

            const formattedPaymentAmount = formatMoney(paymentAmount);
            const requestResponseLabel = requestResponseText(requestResponse, t);

            if (this.props.pdfSaveModeEnabled) {
                return (
                    <PDFExportHelper
                        t={t}
                        payment={requestResponse}
                        formattedPaymentAmount={formattedPaymentAmount}
                        paymentDate={createdDate}
                        paymentDateUpdated={timeRespondedDate}
                        personalAlias={requestResponse.alias}
                        counterPartyAlias={requestResponse.counterparty_alias}
                    />
                );
            }

            noteTextsForm = <NoteTextForm BunqJSClient={this.props.BunqJSClient} event={requestResponse} />;

            content = (
                <React.Fragment>
                    <Paper style={styles.paper}>
                        <Grid container spacing={24} align={"center"} justify={"center"}>
                            <TransactionHeader
                                BunqJSClient={this.props.BunqJSClient}
                                to={requestResponse.alias}
                                from={requestResponse.counterparty_alias}
                                user={this.props.user}
                                swap={requestResponse.status === "ACCEPTED"}
                                type="requestResponse"
                                event={requestResponse}
                                onRequest={this.onRequest}
                                transferAmountComponent={
                                    <MoneyAmountLabel
                                        component={"h1"}
                                        style={{ textAlign: "center" }}
                                        info={requestResponse}
                                        type="requestResponse"
                                    >
                                        {formattedPaymentAmount}
                                    </MoneyAmountLabel>
                                }
                            />

                            <FilterCreationDialog
                                t={t}
                                item={requestResponse}
                                open={this.state.viewFilterCreationDialog}
                                onClose={this.toggleCreateFilterDialog}
                            />

                            <Grid item xs={12}>
                                <List style={styles.list}>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={requestResponseLabel} />
                                    </ListItem>

                                    {requestResponse.description.length > 0
                                        ? [
                                              <Divider />,
                                              <ListItem>
                                                  <ListItemText
                                                      primary={t("Description")}
                                                      secondary={requestResponse.description}
                                                  />
                                              </ListItem>
                                          ]
                                        : null}

                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Received")} secondary={createdDate} />
                                    </ListItem>

                                    {timeRespondedDate ? (
                                        <React.Fragment>
                                            <Divider />
                                            <ListItem>
                                                <ListItemText primary={t("Paid")} secondary={timeRespondedDate} />
                                            </ListItem>
                                        </React.Fragment>
                                    ) : null}

                                    {requestResponse.counterparty_alias && requestResponse.counterparty_alias.iban ? (
                                        <React.Fragment>
                                            <Divider />
                                            <ListItem>
                                                <ListItemText
                                                    primary={t("IBAN")}
                                                    secondary={requestResponse.counterparty_alias.iban}
                                                />
                                            </ListItem>
                                        </React.Fragment>
                                    ) : null}

                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={t("Type")}
                                            secondary={requestResponseTypeParser(requestResponse, t)}
                                        />
                                    </ListItem>

                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Status")} secondary={requestResponse.status} />
                                    </ListItem>

                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Sub type")} secondary={requestResponse.sub_type} />
                                    </ListItem>

                                    <Divider />
                                    <GeoLocationListItem t={t} geoLocation={requestResponse.geolocation} />
                                </List>

                                <CategorySelector type={"RequestResponse"} item={requestResponseInfo} />
                            </Grid>
                        </Grid>
                    </Paper>

                    {!limitedPermissions && requestResponse.status === "PENDING" ? (
                        !this.state.accepted ? (
                            <Paper style={styles.paper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={6}>
                                        <TranslateButton
                                            variant="contained"
                                            color="primary"
                                            style={styles.button}
                                            disabled={this.state.accepted}
                                            onClick={() => {
                                                this.setState({
                                                    accepted: true
                                                });
                                            }}
                                        >
                                            Continue
                                        </TranslateButton>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TranslateButton
                                            variant="contained"
                                            color="secondary"
                                            disabled={requestResponseInfoLoading || requestResponseLoading}
                                            onClick={this.rejectRequest}
                                            style={styles.button}
                                        >
                                            Decline
                                        </TranslateButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ) : (
                            <Paper style={styles.paper}>
                                <Grid container spacing={24} align={"center"} justify={"center"}>
                                    <Grid item xs={12}>
                                        <AccountSelectorDialog
                                            value={this.state.selectedAccount}
                                            onChange={this.handleChangeDirect("selectedAccount")}
                                            accounts={accounts}
                                            BunqJSClient={this.props.BunqJSClient}
                                            hiddenConnectTypes={["showOnly"]}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TranslateButton
                                            variant="contained"
                                            disabled={false}
                                            color="primary"
                                            style={styles.button}
                                            onClick={this.acceptRequest}
                                        >
                                            Accept request
                                        </TranslateButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    ) : null}
                </React.Fragment>
            );
        }

        const exportData =
            this.props.requestResponseInfo && this.props.requestResponseInfo._rawData
                ? this.props.requestResponseInfo._rawData.RequestResponse
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
                    {content}

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

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled,

        requestResponseInfo: state.request_response_info.request_response_info,
        requestResponseAccountId: state.request_response_info.account_id,
        requestResponseInfoLoading: state.request_response_info.loading,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

        requestResponseLoading: state.request_response.loading,

        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        applicationSetPDFMode: enabled => dispatch(applicationSetPDFMode(enabled)),

        requestResponseUpdate: (user_id, account_id, request_response_id) =>
            dispatch(requestResponseUpdate(BunqJSClient, user_id, account_id, request_response_id)),
        requestResponseAccept: (user_id, account_id, request_response_id, amount_responded, options) =>
            dispatch(
                requestResponseAccept(BunqJSClient, user_id, account_id, request_response_id, amount_responded, options)
            ),
        requestResponseReject: (user_id, account_id, request_response_id) =>
            dispatch(requestResponseReject(BunqJSClient, user_id, account_id, request_response_id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(RequestResponseInfo));

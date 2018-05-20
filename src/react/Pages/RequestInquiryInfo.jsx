import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
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

import ExportDialog from "../Components/ExportDialog";
import TranslateButton from "../Components/TranslationHelpers/Button";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";
import CategorySelector from "../Components/Categories/CategorySelector";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import { requestInquiryText } from "../Helpers/StatusTexts";
import { requestInquiryCancel } from "../Actions/request_inquiry";
import { requestInquiryUpdate } from "../Actions/request_inquiry_info";

const styles = {
    btn: {},
    button: {
        width: "100%"
    },
    paper: {
        padding: 24
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class RequestInquiryInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { displayExport: false };
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            const { requestInquiryId, accountId } = this.props.match.params;
            this.props.requestInquiryUpdate(
                this.props.user.id,
                accountId === undefined
                    ? this.props.accountsSelectedAccount
                    : accountId,
                requestInquiryId
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextProps.user &&
            nextProps.user.id &&
            this.props.initialBunqConnect &&
            this.props.match.params.requestInquiryId !==
                nextProps.match.params.requestInquiryId
        ) {
            const { requestInquiryId, accountId } = nextProps.match.params;
            this.props.requestInquiryUpdate(
                nextProps.user.id,
                accountId === undefined
                    ? nextProps.accountsSelectedAccount
                    : accountId,
                requestInquiryId
            );
        }
    }

    cancelInquiry = () => {
        const { requestInquiryId, accountId } = this.props.match.params;
        this.props.requestInquiryCancel(
            this.props.user.id,
            accountId === undefined
                ? this.props.accountsSelectedAccount
                : accountId,
            requestInquiryId
        );
    };

    render() {
        const {
            accountsSelectedAccount,
            requestInquiryInfo,
            requestInquiryLoading,
            requestInquiryInfoLoading,
            t
        } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (
            requestInquiryInfo === false ||
            requestInquiryInfoLoading === true
        ) {
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
            const paymentDate = humanReadableDate(requestInquiry.updated);
            const paymentAmount = requestInquiry.amount_inquired.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const requestInquiryLabel = requestInquiryText(requestInquiry, t);

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={requestInquiry.counterparty_alias}
                        from={requestInquiry.user_alias_created}
                        user={this.props.user}
                    />

                    <Grid item xs={12}>
                        <MoneyAmountLabel
                            component={"h1"}
                            style={{ textAlign: "center" }}
                            info={requestInquiry}
                            type="requestInquiry"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>

                        <Typography
                            style={{ textAlign: "center" }}
                            variant={"body1"}
                        >
                            {requestInquiryLabel}
                        </Typography>

                        <List style={styles.list}>
                            {requestInquiry.description.length > 0 ? (
                                [
                                    <Divider />,
                                    <ListItem>
                                        <ListItemText
                                            primary={"Description"}
                                            secondary={
                                                requestInquiry.description
                                            }
                                        />
                                    </ListItem>
                                ]
                            ) : null}

                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Date")}
                                    secondary={paymentDate}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"IBAN"}
                                    secondary={
                                        requestInquiry.counterparty_alias.iban
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </List>

                        {requestInquiry.status === "PENDING" ? (
                            <Grid container spacing={16} justify="center">
                                <Grid item xs={12} sm={6}>
                                    <TranslateButton
                                        variant="raised"
                                        disabled={
                                            requestInquiryLoading ||
                                            requestInquiryInfoLoading
                                        }
                                        onClick={this.cancelInquiry}
                                        color="secondary"
                                        style={styles.button}
                                    >
                                        Cancel
                                    </TranslateButton>
                                </Grid>
                            </Grid>
                        ) : null}

                        <CategorySelector
                            type={"RequestInquiry"}
                            item={requestInquiryInfo}
                        />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.requestInquiryInfo &&
            this.props.requestInquiryInfo._rawData
                ? this.props.requestInquiryInfo._rawData.RequestInquiry
                : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Request Info")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2} lg={3}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} lg={6}>
                    <Paper style={styles.paper}>{content}</Paper>
                </Grid>

                <Grid item xs={12} sm={2} lg={3} style={{ textAlign: "right" }}>
                    <ExportDialog
                        closeModal={event =>
                            this.setState({ displayExport: false })}
                        title={t("Export info")}
                        open={this.state.displayExport}
                        object={exportData}
                    />

                    <Button
                        style={styles.button}
                        onClick={event =>
                            this.setState({ displayExport: true })}
                    >
                        <HelpIcon />
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        requestInquiryInfo: state.request_inquiry_info.request_inquiry_info,
        requestInquiryInfoLoading: state.request_inquiry_info.loading,
        requestInquiryLoading: state.request_inquiry.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        requestInquiryUpdate: (user_id, account_id, request_inquiry_id) =>
            dispatch(
                requestInquiryUpdate(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_inquiry_id
                )
            ),
        requestInquiryCancel: (user_id, account_id, request_inquiry_id) =>
            dispatch(
                requestInquiryCancel(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_inquiry_id
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(RequestInquiryInfo)
);

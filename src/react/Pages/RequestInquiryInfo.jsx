import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Typography from "material-ui/Typography";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import { requestInquiryText } from "../Helpers/StatusTexts";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";

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
        this.state = {};
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
            requestInquiryInfoLoading
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
            const requestInquiryLabel = requestInquiryText(requestInquiry);

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
                            type={"body1"}
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
                                    primary={"Date"}
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
                                    <Button
                                        raised
                                        disabled={
                                            requestInquiryLoading ||
                                            requestInquiryInfoLoading
                                        }
                                        onClick={this.cancelInquiry}
                                        color="secondary"
                                        style={styles.button}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Request Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>{content}</Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestInquiryInfo);

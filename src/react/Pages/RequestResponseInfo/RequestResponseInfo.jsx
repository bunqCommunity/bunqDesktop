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
import Collapse from "material-ui/transitions/Collapse";

import { formatMoney, humanReadableDate } from "../../Helpers/Utils";
import { requestResponseText } from "../../Helpers/StatusTexts";
import MoneyAmountLabel from "../../Components/MoneyAmountLabel";

import { requestResponseUpdate } from "../../Actions/request_response_info";
import {
    requestResponseReject,
    requestResponseAccept
} from "../../Actions/request_response";
import TransactionHeader from "../../Components/TransactionHeader";
import AddressForm from "./AddressForm";

const testData = require("./test.json");

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
            address_billing: false,
            address_shipping: false
        };
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            const { requestResponseId, accountId } = this.props.match.params;
            this.props.requestResponseUpdate(
                this.props.user.id,
                accountId === undefined
                    ? this.props.accountsSelectedAccount
                    : accountId,
                requestResponseId
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            this.props.initialBunqConnect &&
            this.props.match.params.requestResponseId !==
                nextProps.match.params.requestResponseId
        ) {
            const { requestResponseId, accountId } = nextProps.match.params;
            this.props.requestResponseUpdate(
                nextProps.user.id,
                accountId === undefined
                    ? nextProps.accountsSelectedAccount
                    : accountId,
                requestResponseId
            );
        }
    }

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target ? event.target.value : event
            },
            this.validateForm
        );
    };

    rejectRequest = () => {
        const { requestResponseId, accountId } = this.props.match.params;
        this.props.requestResponseReject(
            this.props.user.id,
            accountId === undefined
                ? this.props.accountsSelectedAccount
                : accountId,
            requestResponseId
        );
    };

    acceptRequest = () => {
        const { requestResponseId } = this.props.match.params;
        let {
            user,
            requestResponseInfo,
            requestResponseAccountId
        } = this.props;
        requestResponseInfo = testData;

        const requestResponse = requestResponseInfo.RequestResponse;

        const billingAddressRequired = ["BILLING", "BILLING_SHIPPING"].includes(
            requestResponse.require_address
        );
        const shippingAddressRequired = [
            "SHIPPING",
            "BILLING_SHIPPING"
        ].includes(requestResponse.require_address);

        const options = {
            address_shipping: false,
            address_billing: false
        };
        if (billingAddressRequired) {
            if (this.state.address_billing === false) {
                return false;
            }
            options.address_billing = this.state.address_billing;
        }
        if (shippingAddressRequired) {
            if (this.state.address_shipping === false) {
                return false;
            }
            options.address_shipping = this.state.address_shipping;
        }

        this.props.requestResponseAccept(
            user.id,
            requestResponseAccountId,
            requestResponseId,
            requestResponse.amount_inquired,
            options
        );
    };

    render() {
        let {
            accountsSelectedAccount,
            requestResponseInfo,
            requestResponseInfoLoading,
            requestResponseLoading
        } = this.props;
        requestResponseInfo = testData;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (
            requestResponseInfo === false ||
            requestResponseInfoLoading === true
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
            const paymentDate = humanReadableDate(requestResponse.updated);
            const paymentAmount = requestResponse.amount_inquired.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const requestResponseLabel = requestResponseText(requestResponse);

            const billingAddressRequired = [
                "BILLING",
                "BILLING_SHIPPING"
            ].includes(requestResponse.require_address);
            const billingAddressVisible = [
                "OPTIONAL",
                "BILLING",
                "BILLING_SHIPPING"
            ].includes(requestResponse.require_address);

            const shippingAddressRequired = [
                "SHIPPING",
                "BILLING_SHIPPING"
            ].includes(requestResponse.require_address);
            const shippingAddressVisible = [
                "OPTIONAL",
                "SHIPPING",
                "BILLING_SHIPPING"
            ].includes(requestResponse.require_address);

            content = [
                <Paper style={styles.paper}>
                    <Grid
                        container
                        spacing={24}
                        align={"center"}
                        justify={"center"}
                    >
                        <TransactionHeader
                            BunqJSClient={this.props.BunqJSClient}
                            to={requestResponse.alias}
                            from={requestResponse.counterparty_alias}
                        />

                        <Grid item xs={12}>
                            <MoneyAmountLabel
                                component={"h1"}
                                style={{ textAlign: "center" }}
                                info={requestResponse}
                                type="requestResponse"
                            >
                                {formattedPaymentAmount}
                            </MoneyAmountLabel>

                            <Typography
                                style={{ textAlign: "center" }}
                                type={"body1"}
                            >
                                {requestResponseLabel}
                            </Typography>

                            <List style={styles.list}>
                                {requestResponse.description.length > 0 ? (
                                    [
                                        <Divider />,
                                        <ListItem>
                                            <ListItemText
                                                primary={"Description"}
                                                secondary={
                                                    requestResponse.description
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
                                            requestResponse.counterparty_alias
                                                .iban
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </List>

                            {requestResponse.status === "PENDING" ? (
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            raised
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
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            raised
                                            color="secondary"
                                            disabled={
                                                requestResponseInfoLoading ||
                                                requestResponseLoading
                                            }
                                            onClick={this.rejectRequest}
                                            style={styles.button}
                                        >
                                            Decline
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Grid>
                </Paper>,
                <Collapse in={this.state.accepted} collapsedHeight="0px">
                    <Paper style={styles.paper}>
                        <Grid
                            container
                            spacing={24}
                            align={"center"}
                            justify={"center"}
                        >
                            <Grid item xs={12}>
                                <AddressForm
                                    requestResponse={requestResponse}
                                    required={shippingAddressRequired}
                                    visible={shippingAddressVisible}
                                    labelValue={"Shipping Address"}
                                    onChange={this.handleChange(
                                        "address_shipping"
                                    )}
                                />
                                <AddressForm
                                    requestResponse={requestResponse}
                                    required={billingAddressRequired}
                                    visible={billingAddressVisible}
                                    labelValue={"Billing Address"}
                                    onChange={this.handleChange(
                                        "address_billing"
                                    )}
                                />

                                <Button
                                    raised
                                    disabled={
                                        (shippingAddressRequired
                                            ? this.state.address_shipping ===
                                              false
                                            : false) ||
                                        (billingAddressRequired
                                            ? this.state.address_billing ===
                                              false
                                            : false)
                                    }
                                    color="primary"
                                    style={styles.button}
                                    onClick={this.acceptRequest}
                                >
                                    Accept request
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Collapse>
            ];
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
                    {content}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        requestResponseInfo: state.request_response_info.request_response_info,
        requestResponseAccountId: state.request_response_info.account_id,
        requestResponseInfoLoading: state.request_response_info.loading,
        requestResponseLoading: state.request_response.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        requestResponseUpdate: (user_id, account_id, request_response_id) =>
            dispatch(
                requestResponseUpdate(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_response_id
                )
            ),
        requestResponseAccept: (
            user_id,
            account_id,
            request_response_id,
            amount_responded,
            options
        ) =>
            dispatch(
                requestResponseAccept(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_response_id,
                    amount_responded,
                    options
                )
            ),
        requestResponseReject: (user_id, account_id, request_response_id) =>
            dispatch(
                requestResponseReject(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_response_id
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    RequestResponseInfo
);

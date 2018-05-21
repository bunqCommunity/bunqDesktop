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

import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/Help";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import ExportDialog from "../Components/ExportDialog";
import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import { paymentText, paymentTypeParser } from "../Helpers/StatusTexts";

import SpeedDial from "../Components/SpeedDial";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";
import CategorySelectorDialog from "../Components/Categories/CategorySelectorDialog";
import CategoryChips from "../Components/Categories/CategoryChips";

import { paymentsUpdate } from "../Actions/payment_info";

const styles = {
    btn: {},
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

class PaymentInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            displayExport: false,
            displayCategories: false
        };
    }

    componentDidMount() {
        if (
            this.props.user &&
            this.props.user.id &&
            this.props.initialBunqConnect
        ) {
            const { paymentId, accountId } = this.props.match.params;
            this.props.updatePayment(
                this.props.user.id,
                accountId === undefined
                    ? this.props.accountsSelectedAccount
                    : accountId,
                paymentId
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextProps.user &&
            nextProps.user.id &&
            this.props.initialBunqConnect &&
            this.props.match.params.paymentId !==
                nextProps.match.params.paymentId
        ) {
            const { paymentId, accountId } = nextProps.match.params;
            this.props.updatePayment(
                nextProps.user.id,
                accountId === undefined
                    ? nextProps.accountsSelectedAccount
                    : accountId,
                paymentId
            );
        }
    }

    toggleCategoryDialog = event =>
        this.setState({ displayCategories: !this.state.displayCategories });

    startPaymentIban = alias => {
        this.props.history.push(
            `/pay?iban=${alias.iban}&iban-name=${alias.display_name}`
        );
    };
    startPayment = event => {
        const paymentInfo = this.props.paymentInfo;
        this.props.history.push(`/pay?amount=${paymentInfo.getAmount()}`);
    };
    startRequest = event => {
        const paymentInfo = this.props.paymentInfo;
        this.props.history.push(`/request?amount=${paymentInfo.getAmount()}`);
    };

    render() {
        const {
            accountsSelectedAccount,
            paymentInfo,
            paymentLoading,
            theme,
            t
        } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (paymentInfo === false || paymentLoading === true) {
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
            const paymentAmount = payment.amount.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const paymentLabel = paymentText(payment, t);
            const counterPartyIban = payment.counterparty_alias.iban;

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={payment.counterparty_alias}
                        from={payment.alias}
                        user={this.props.user}
                        accounts={this.props.accounts}
                        startPaymentIban={this.startPaymentIban}
                        swap={paymentAmount > 0}
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

                        <Typography
                            style={{ textAlign: "center" }}
                            variant={"body1"}
                        >
                            {paymentLabel}
                        </Typography>

                        <List style={styles.list}>
                            {paymentDescription.length > 0 ? (
                                [
                                    <Divider />,
                                    <ListItem>
                                        <ListItemText
                                            primary={"Description"}
                                            secondary={paymentDescription}
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
                                    primary={t("Payment Type")}
                                    secondary={paymentTypeParser(
                                        payment.type,
                                        t
                                    )}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"IBAN"}
                                    secondary={counterPartyIban}
                                />
                            </ListItem>
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
                                    name: "Send payment",
                                    icon: ArrowUpIcon,
                                    color: "action",
                                    onClick: this.startPayment
                                },
                                {
                                    name: "Send request",
                                    icon: ArrowDownIcon,
                                    color: "action",
                                    onClick: this.startRequest
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
                                        this.setState({ displayExport: true })
                                }
                            ]}
                        />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.paymentInfo && this.props.paymentInfo._rawData
                ? this.props.paymentInfo._rawData.Payment
                : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Payment Info")}`}</title>
                </Helmet>

                <ExportDialog
                    closeModal={event =>
                        this.setState({ displayExport: false })}
                    title={t("Export info")}
                    open={this.state.displayExport}
                    object={exportData}
                />

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
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        paymentInfo: state.payment_info.payment,
        paymentLoading: state.payment_info.loading,
        accountsSelectedAccount: state.accounts.selectedAccount,
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        updatePayment: (user_id, account_id, payment_id) =>
            dispatch(
                paymentsUpdate(BunqJSClient, user_id, account_id, payment_id)
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(PaymentInfo)
);

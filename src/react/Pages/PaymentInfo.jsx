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
import { paymentText, paymentTypeParser } from "../Helpers/StatusTexts";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import TransactionHeader from "../Components/TransactionHeader";

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
        this.state = {};
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
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

    render() {
        const { accountsSelectedAccount, payment, paymentLoading } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (payment === false || paymentLoading === true) {
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
            const paymentDescription = payment.description;
            const paymentDate = humanReadableDate(payment.created);
            const paymentAmount = payment.amount.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const paymentLabel = paymentText(payment);
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
                            type={"body1"}
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
                                    primary={"Date"}
                                    secondary={paymentDate}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Payment Type"}
                                    secondary={paymentTypeParser(payment.type)}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"IBAN"}
                                    secondary={counterPartyIban}
                                />
                            </ListItem>
                            <Divider />
                        </List>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Payment Info`}</title>
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
        payment: state.payment_info.payment,
        paymentLoading: state.payment_info.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfo);

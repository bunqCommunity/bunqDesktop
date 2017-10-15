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
import ArrowForwardIcon from "material-ui-icons/ArrowForward";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";
import CircularProgress from "material-ui/Progress/CircularProgress";

import NavLink from "../Components/Sub/NavLink";

import { accountsUpdate } from "../Actions/accounts";
import { userLogin } from "../Actions/user";
import { paymentInfoUpdate } from "../Actions/payment_info";

const styles = {
    btn: {},
    paper: {
        padding: 24
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
        const { paymentId } = this.props.match.params;
        this.props.updatePayment(this.props.accountsSelectedAccount, paymentId);
    }

    getBasicInfo(info) {
        let result = {};

        result.avatar = info.avatar;
        result.icon_uri =
            "https://static.useresponse.com/public/bunq/avatars/default-avatar.svg";
        if (result.avatar) {
            result.icon_uri = `/api/attachment/${result.avatar.image[0]
                .attachment_public_uuid}`;
        }
        result.displayName = info.display_name;
        result.iban = info.iban;

        return result;
    }

    render() {
        const { accountsSelectedAccount, payment, paymentLoading } = this.props;
        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false) {
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
            // const paymentType = payment.type;
            const paymentDescription = payment.description;
            const paymentDate = new Date(payment.created).toLocaleString();
            const paymentAmount = payment.amount.value;
            const paymentColor = paymentAmount < 0 ? "orange" : "green";

            const personalInfo = this.getBasicInfo(payment.alias);
            const counterPartyInfo = this.getBasicInfo(
                payment.counterparty_alias
            );

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <Grid item xs={12} sm={5} style={styles.textCenter}>
                        <img width={90} src={personalInfo.icon_uri} />
                        <h3>{personalInfo.displayName}</h3>
                    </Grid>

                    <Grid
                        item
                        sm={2}
                        hidden={{ xsDown: true }}
                        style={styles.textCenter}
                    >
                        {paymentAmount < 0 ? (
                            <ArrowForwardIcon />
                        ) : (
                            <ArrowBackIcon />
                        )}
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        hidden={{ smUp: true }}
                        style={styles.textCenter}
                    >
                        {paymentAmount < 0 ? (
                            <ArrowDownIcon />
                        ) : (
                            <ArrowUpIcon />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={5} style={styles.textCenter}>
                        <img width={90} src={counterPartyInfo.icon_uri} />
                        <h3>{counterPartyInfo.displayName}</h3>
                    </Grid>

                    <Grid item xs={12}>
                        <h1
                            style={{
                                textAlign: "center",
                                color: paymentColor
                            }}
                        >
                            € {paymentAmount}
                        </h1>
                        <List>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Description"}
                                    secondary={paymentDescription}
                                />
                            </ListItem>
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
                                    secondary={counterPartyInfo.iban}
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
                    <title>{`BunqWeb - Payment Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={3}>
                    <Button to={"/"} component={NavLink} style={styles.btn}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
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

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (id, type) => dispatch(userLogin(id, type)),
        updateAccounts: () => dispatch(accountsUpdate()),
        updatePayment: (account_id, payment_id) =>
            dispatch(paymentInfoUpdate(account_id, payment_id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfo);

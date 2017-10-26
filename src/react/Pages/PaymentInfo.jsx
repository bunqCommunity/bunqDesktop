import React from "react";
import { connect } from "react-redux";
import { withTheme } from "material-ui/styles";
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
import Typography from "material-ui/Typography";

import { humanReadableDate,formatMoney } from "../Helpers/Utils";
import NavLink from "../Components/Routing/NavLink";
import AttachmentImage from "../Components/AttachmentImage";

import { paymentsUpdate } from "../Actions/payment_info";

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
        if (this.props.initialBunqConnect) {
            const { paymentId } = this.props.match.params;
            this.props.updatePayment(
                this.props.user.id,
                this.props.accountsSelectedAccount,
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
            const { paymentId } = this.props.match.params;
            this.props.updatePayment(
                this.props.user.id,
                this.props.accountsSelectedAccount,
                paymentId
            );
        }
    }

    getBasicInfo(info) {
        let result = {};

        result.avatar = info.avatar;
        result.imageUUID = false;
        if (result.avatar) {
            result.imageUUID = result.avatar.image[0].attachment_public_uuid;
        }
        result.displayName = info.display_name;
        result.iban = info.iban;

        return result;
    }

    render() {
        const {
            accountsSelectedAccount,
            payment,
            paymentLoading,
            theme
        } = this.props;

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
            const paymentColor =
                paymentAmount < 0
                    ? theme.palette.common.sentPayment
                    : theme.palette.common.receivedPayment;

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
                    <Grid item xs={12} md={5} style={styles.textCenter}>
                        <AttachmentImage
                            width={90}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={personalInfo.imageUUID}
                        />
                        <Typography type="subheading">
                            {personalInfo.displayName}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        md={2}
                        hidden={{ smDown: true }}
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
                        hidden={{ mdUp: true }}
                        style={styles.textCenter}
                    >
                        {paymentAmount < 0 ? (
                            <ArrowDownIcon />
                        ) : (
                            <ArrowUpIcon />
                        )}
                    </Grid>

                    <Grid item xs={12} md={5} style={styles.textCenter}>
                        <AttachmentImage
                            width={90}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={counterPartyInfo.imageUUID}
                        />

                        <Typography type="subheading">
                            {counterPartyInfo.displayName}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <h1
                            style={{
                                textAlign: "center",
                                color: paymentColor
                            }}
                        >
                            {formatMoney(paymentAmount)}
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
                                    primary={"Payment Type"}
                                    secondary={payment.type}
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
                    <title>{`BunqDesktop - Payment Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button to={"/"} component={NavLink} style={styles.btn}>
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

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(PaymentInfo)
);

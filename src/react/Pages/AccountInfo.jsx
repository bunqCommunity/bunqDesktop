import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";
import ArrowBackIcon from "material-ui-icons/ArrowBack";

import PaymentList from "./Dashboard/PaymentList";
import AccountQRCode from "../Components/QR/AccountQRCode";
import AttachmentImage from "../Components/AttachmentImage";

import { accountsUpdate } from "../Actions/accounts";
import { paymentsUpdate } from "../Actions/payments";

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

class AccountInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            this.props.accountsUpdate(this.props.user.id);
            this.props.paymentsUpdate(
                this.props.user.id,
                parseFloat(this.props.match.params.accountId)
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { initialBunqConnect, user } = nextProps;
        const accountId = parseFloat(this.props.match.params.accountId);
        const nextAccountId = parseFloat(nextProps.match.params.accountId);

        if (initialBunqConnect && nextAccountId !== accountId) {
            this.props.accountsUpdate(user.id);
            this.props.paymentsUpdate(user.id, nextAccountId);
        }
    }

    render() {
        const { accounts } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        let accountInfo = false;
        accounts.map(account => {
            if (account.MonetaryAccountBank.id === accountId) {
                accountInfo = account.MonetaryAccountBank;
            }
        });

        let content = null;
        if (accountInfo !== false) {
            content = [
                <Paper style={styles.paper}>
                    <Grid
                        container
                        spacing={24}
                        align={"center"}
                        justify={"center"}
                    >
                        <Grid item xs={12} sm={8}>
                            <AttachmentImage
                                width={160}
                                BunqJSClient={this.props.BunqJSClient}
                                imageUUID={
                                    accountInfo.avatar.image[0]
                                        .attachment_public_uuid
                                }
                            />
                            <Typography type="subheading">
                                {accountInfo.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} style={styles.textCenter}>
                            <AccountQRCode accountId={accountInfo.id} />
                        </Grid>
                    </Grid>
                </Paper>,
                <Paper style={styles.paper}>
                    <PaymentList
                        BunqJSClient={this.props.BunqJSClient}
                        initialBunqConnect={this.props.initialBunqConnect}
                    />
                </Paper>
            ];
        } else {
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
        }

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Account Info`}</title>
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
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentsUpdate(BunqJSClient, userId, accountId)),
        accountsUpdate: userId => dispatch(accountsUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);

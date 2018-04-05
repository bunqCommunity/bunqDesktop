import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import StickyBox from "react-sticky-box";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import MoneyIcon from "material-ui-icons/AttachMoney";

import CombinedList from "../Components/CombinedList";
import AccountList from "../Components/AccountList/AccountList";
import LoadOlderButton from "../Components/LoadOlderButton";

import { userLogin, userLogout } from "../Actions/user";
import { requestInquirySend } from "../Actions/request_inquiry";

const styles = {
    btn: {
        width: "100%"
    }
};

class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidUpdate() {
        if (
            this.props.userType !== false &&
            this.props.userLoading === false &&
            this.props.usersLoading === false &&
            this.props.user === false
        ) {
            this.props.userLogin(this.props.userType, false);
        }
    }

    addMoney = event => {
        if (!this.props.requestInquiryLoading) {
            const requestInquiry = {
                amount_inquired: {
                    value: "500",
                    currency: "EUR"
                },
                counterparty_alias: {
                    type: "EMAIL",
                    value: "sugardaddy@bunq.com"
                },
                description: "Please daddy??",
                allow_bunqme: true
            };
            this.props.requestInquirySend(
                this.props.user.id,
                this.props.selectedAccount,
                [requestInquiry]
            );
        }
    };

    render() {
        const t = this.props.t;

        const userTypes = Object.keys(this.props.users);

        const switchUserText = t("Switch user");

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Dashboard")}`}</title>
                </Helmet>

                <Grid item xs={8} sm={10}>
                    <Typography variant="title" gutterBottom>
                        {`${t("Welcome")} ${this.props.user.display_name}`}
                    </Typography>
                </Grid>

                {/* hide the switch button if only one user is set */}
                {userTypes.length > 1 ? (
                    <Grid item xs={4} sm={2}>
                        <Button
                            style={styles.btn}
                            onClick={this.props.logoutUser}
                        >
                            {switchUserText}
                        </Button>
                    </Grid>
                ) : null}

                <Grid item xs={12} md={4}>
                    <StickyBox className={"sticky-container"}>
                        <Paper>
                            <AccountList
                                BunqJSClient={this.props.BunqJSClient}
                                initialBunqConnect={
                                    this.props.initialBunqConnect
                                }
                            />

                            <LoadOlderButton
                                wrapperStyle={{ padding: 8 }}
                                buttonStyle={{ width: "100%" }}
                                buttonContent={t("Load more events")}
                                BunqJSClient={this.props.BunqJSClient}
                                initialBunqConnect={
                                    this.props.initialBunqConnect
                                }
                            />

                            {this.props.environment === "SANDBOX" ? (
                                <div
                                    style={{ textAlign: "center", padding: 16 }}
                                >
                                    <Typography>
                                        {t("Psst, want some money?")}
                                    </Typography>
                                    <Button
                                        variant={"raised"}
                                        onClick={this.addMoney}
                                        disabled={
                                            this.props.requestInquiryLoading
                                        }
                                    >
                                        <MoneyIcon /> {t("Yes")} <MoneyIcon />
                                    </Button>
                                </div>
                            ) : null}
                        </Paper>
                    </StickyBox>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper>
                        <CombinedList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        users: state.users.users,
        userType: state.user.user_type,
        userLoading: state.user.loading,
        usersLoading: state.users.loading,

        requestInquiryLoading: state.request_inquiry.loading,
        selectedAccount: state.accounts.selectedAccount,

        environment: state.registration.environment
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        logoutUser: () => dispatch(userLogout()),
        requestInquirySend: (userId, accountId, requestInquiries) =>
            dispatch(
                requestInquirySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    requestInquiries
                )
            ),
        userLogin: (type, updated = false) =>
            dispatch(userLogin(BunqJSClient, type, updated))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Dashboard)
);

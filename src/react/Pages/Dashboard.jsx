import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import StickyBox from "react-sticky-box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

import MoneyIcon from "@material-ui/icons/AttachMoney";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import KeyIcon from "@material-ui/icons/VpnKey";

import CombinedList from "../Components/CombinedList/CombinedList";
import AccountList from "../Components/AccountList/AccountList";
import NavLink from "../Components/Routing/NavLink";
import AttachmentImage from "../Components/AttachmentImage/AttachmentImage";

import { userLogin, userLogout } from "../Actions/user";
import { requestInquirySend } from "../Actions/request_inquiry";
import { registrationLogOut } from "../Actions/registration";

const styles = {
    btn: {
        width: "100%"
    },
    bigAvatar: {
        width: 50,
        height: 50
    },
    iconButton: {
        marginLeft: 16
    },
    title: {
        marginBottom: 0,
        marginLeft: 12
    },
    titleWrapper: {
        display: "flex",
        alignItems: "center"
    },
    headerButtonWrapper: {
        textAlign: "right"
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
            this.props.requestInquirySend(this.props.user.id, this.props.selectedAccount, [requestInquiry]);
        }
    };

    render() {
        const t = this.props.t;
        const user = this.props.user;
        const userTypes = Object.keys(this.props.users);

        const displayName = this.props.user.display_name ? this.props.user.display_name : t("user");

        const profileAvatar = user ? (
            <Avatar style={styles.bigAvatar}>
                <AttachmentImage
                    height={50}
                    BunqJSClient={this.props.BunqJSClient}
                    imageUUID={user.avatar.image[0].attachment_public_uuid}
                />
            </Avatar>
        ) : null;

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Dashboard")}`}</title>
                </Helmet>

                <Hidden mdDown>
                    <Grid item lg={1} xl={2} />
                </Hidden>

                <Grid item xs={12} md={12} lg={10} xl={8}>
                    <Grid container spacing={16}>
                        <Grid item xs={6} style={styles.titleWrapper}>
                            {this.props.limitedPermissions ? (
                                profileAvatar
                            ) : (
                                <NavLink to={"/profile"}>{profileAvatar}</NavLink>
                            )}

                            <Typography variant="title" gutterBottom style={styles.title}>
                                {`${t("Welcome")} ${displayName}`}
                            </Typography>
                        </Grid>

                        <Grid item xs={6} style={styles.headerButtonWrapper}>
                            {userTypes.length > 1 ? (
                                <Button style={styles.btn} onClick={this.props.logoutUser}>
                                    {t("Switch user")}
                                </Button>
                            ) : null}

                            <Tooltip id="tooltip-fab" title="Switch API keys">
                                <IconButton style={styles.iconButton} onClick={this.props.registrationLogOut}>
                                    <KeyIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip id="tooltip-fab" title="Logout of account">
                                <IconButton
                                    style={styles.iconButton}
                                    onClick={() => {
                                        if (this.props.useNoPassword) {
                                            // if no password is set
                                            this.props.registrationLogOut();
                                        }
                                        location.reload();
                                    }}
                                >
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item xs={12} sm={5} md={4}>
                            <StickyBox className={"sticky-container"}>
                                <Paper>
                                    <AccountList
                                        BunqJSClient={this.props.BunqJSClient}
                                        initialBunqConnect={this.props.initialBunqConnect}
                                    />

                                    {/*<LoadOlderButton*/}
                                    {/*wrapperStyle={{ padding: 8 }}*/}
                                    {/*buttonStyle={{ width: "100%" }}*/}
                                    {/*buttonContent={t("Load more events")}*/}
                                    {/*BunqJSClient={this.props.BunqJSClient}*/}
                                    {/*initialBunqConnect={*/}
                                    {/*this.props.initialBunqConnect*/}
                                    {/*}*/}
                                    {/*/>*/}

                                    {this.props.environment === "SANDBOX" ? (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                padding: 16
                                            }}
                                        >
                                            <Button onClick={this.addMoney} disabled={this.props.requestInquiryLoading}>
                                                <MoneyIcon />
                                            </Button>
                                        </div>
                                    ) : null}
                                </Paper>
                            </StickyBox>
                        </Grid>

                        <Grid item xs={12} sm={7} md={8}>
                            <Paper>
                                <CombinedList
                                    BunqJSClient={this.props.BunqJSClient}
                                    initialBunqConnect={this.props.initialBunqConnect}
                                    displayRequestPayments={false}
                                    displayAcceptedRequests={true}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
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
        limitedPermissions: state.user.limited_permissions,
        usersLoading: state.users.loading,

        requestInquiryLoading: state.request_inquiry.loading,
        selectedAccount: state.accounts.selected_account,

        useNoPassword: state.registration.use_no_password,
        storedApiKeys: state.registration.stored_api_keys,
        environment: state.registration.environment
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // only resets user type
        logoutUser: () => dispatch(userLogout()),

        // hard-logout
        registrationLogOut: () => dispatch(registrationLogOut(BunqJSClient)),

        // send a request, used for sandbox button
        requestInquirySend: (userId, accountId, requestInquiries) =>
            dispatch(requestInquirySend(BunqJSClient, userId, accountId, requestInquiries)),
        userLogin: (type, updated = false) => dispatch(userLogin(BunqJSClient, type, updated))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Dashboard));

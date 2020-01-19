import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import StickyBox from "react-sticky-box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import TranslateButton from "../../Components/TranslationHelpers/Button";
import CombinedList from "../../Components/CombinedList/CombinedList";
import AccountList from "../../Components/AccountList/AccountList";
import NavLink from "../../Components/Routing/NavLink";
import AttachmentImage from "../../Components/AttachmentImage/AttachmentImage";
import SavingsGoalsList from "../../Components/SavingsGoals/SavingsGoalsList";
import SwitchKeysMenu from "../../Components/SwitchKeysMenu";
import AddMoneyButton from "./AddMoneyButton";

import { registrationLogOut } from "../../Actions/registration";

const styles = {
    btn: {
        width: "100%"
    },
    savingsGoalsButton: {
        width: "100%",
        marginTop: 16
    },
    bigAvatar: {
        width: 50,
        height: 50
    },
    iconButton: {
        marginLeft: 16
    },
    tabItems: {
        minWidth: "20px"
    },
    title: {
        marginBottom: 0,
        marginLeft: 12
    },
    savingsGoalsPaper: {
        padding: 12
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
        this.state = {
            selectedTab: "accounts"
        };
    }

    handleChange = (event, value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        const { t, user, userType, savingsGoals } = this.props;
        const selectedTab = this.state.selectedTab;

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

        const displaySavingsGoals = Object.keys(savingsGoals).some(savingsGoalId => {
            const savingsGoal = savingsGoals[savingsGoalId];
            return !savingsGoal.isEnded && savingsGoal.isStarted;
        });
        let isBunqPromoUser = false;
        if (user && user.customer_limit && user.customer_limit.limit_amount_monthly) {
            isBunqPromoUser = true;
        }
        const tabsEnabled = displaySavingsGoals;

        let tabsComponent = null;
        if (tabsEnabled) {
            tabsComponent = (
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.selectedTab}
                        onChange={this.handleChange}
                        color="primary"
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab style={styles.tabItems} value="accounts" label={t("Accounts")} />
                        {displaySavingsGoals && (
                            <Tab style={styles.tabItems} value="savingsGoals" label={t("Savings goals")} />
                        )}
                    </Tabs>
                </AppBar>
            );
        }

        let userTypeLabel = "";
        const OAuthLabel = t("OAuth");
        const businessLabel = t("Business");
        const personalLabel = t("Personal");
        const bunqPromoLabel = t("bunq promo");
        switch (userType) {
            case "UserCompany":
                userTypeLabel = `${businessLabel} ${t("account")}`;
                break;
            case "UserApiKey":
                userTypeLabel = `${OAuthLabel} ${t("account")}`;
                break;
            default:
            case "UserPerson":
                if (isBunqPromoUser) {
                    userTypeLabel = `${bunqPromoLabel} ${t("account")}`;
                } else {
                    userTypeLabel = `${personalLabel} ${t("account")}`;
                }
                break;
        }

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

                            <div>
                                <Typography variant="h5" gutterBottom style={styles.title}>
                                    {displayName}
                                </Typography>
                                <Typography variant="body1" gutterBottom style={styles.title}>
                                    {userTypeLabel}
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={6} style={styles.headerButtonWrapper}>
                            <SwitchKeysMenu history={this.props.history} BunqJSClient={this.props.BunqJSClient} />

                            <Tooltip id="tooltip-fab" title={t("Logout")}>
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
                            <StickyBox className="sticky-container">
                                {tabsComponent}

                                {(selectedTab === "accounts" || tabsEnabled === false) && (
                                    <Paper>
                                        <AccountList BunqJSClient={this.props.BunqJSClient} />

                                        <AddMoneyButton user={this.props.user} BunqJSClient={this.props.BunqJSClient} />
                                    </Paper>
                                )}

                                {selectedTab === "savingsGoals" && displaySavingsGoals && (
                                    <Paper style={styles.savingsGoalsPaper}>
                                        <SavingsGoalsList hiddenTypes={["ended", "expired"]} type="small" />

                                        <TranslateButton
                                            component={NavLink}
                                            to="/savings-goal-page/null"
                                            variant="outlined"
                                            color="primary"
                                            style={styles.savingsGoalsButton}
                                        >
                                            New savings goal
                                        </TranslateButton>

                                        <TranslateButton
                                            component={NavLink}
                                            to="/savings-goals"
                                            variant="outlined"
                                            style={styles.savingsGoalsButton}
                                        >
                                            More details
                                        </TranslateButton>
                                    </Paper>
                                )}
                            </StickyBox>
                        </Grid>

                        <Grid item xs={12} sm={7} md={8}>
                            <Paper>
                                <CombinedList
                                    BunqJSClient={this.props.BunqJSClient}
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
        userType: state.user.user_type,
        userLoading: state.user.loading,
        limitedPermissions: state.user.limited_permissions,
        usersLoading: state.users.loading,

        requestInquiryLoading: state.request_inquiry.loading,
        selectedAccount: state.accounts.selected_account,

        savingsGoals: state.savings_goals.savings_goals,

        derivedPassword: state.registration.derived_password,
        derivedPasswordIdentifier: state.registration.identifier,
        useNoPassword: state.registration.use_no_password,
        storedApiKeys: state.registration.stored_api_keys,
        environment: state.registration.environment
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // hard-logout
        registrationLogOut: () => dispatch(registrationLogOut())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Dashboard));

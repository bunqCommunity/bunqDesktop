import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { withRouter } from "react-router";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// custom components
import BunqErrorHandler from "../Functions/BunqErrorHandler";
import Logger from "../Functions/Logger";
import VersionChecker from "../Functions/VersionChecker";
import NetworkStatusChecker from "./NetworkStatusChecker";
import RuleCollectionChecker from "./RuleCollectionChecker";
import QueueManager from "./Queue/QueueManager";
import MainDialog from "./MainDialog";
import MainSnackbar from "./MainSnackbar";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";

// themes
import DefaultThemeConfig from "../Themes/DefaultTheme";
import DarkThemeConfig from "../Themes/DarkTheme";
const DefaultTheme = createMuiTheme(DefaultThemeConfig);
const DarkTheme = createMuiTheme(DarkThemeConfig);
const ThemeList = {
    DefaultTheme,
    DarkTheme
};

// redux actions
import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import { registrationClearUserInfo, registrationSetBunqDesktopClientData } from "../Actions/registration";
import { setHideBalance, setTheme, setAutomaticThemeChange } from "../Actions/options";
import { queueStartSync } from "../Actions/queue";

const styles = theme => ({
    contentContainer: {
        margin: 0,
        marginLeft: 0,
        width: "100%"
    },
    contentContainerSticky: {
        margin: 0,
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("md")]: {
            margin: 0,
            marginLeft: 250,
            width: "calc(100% - 250px)"
        }
    },
    main: {
        marginTop: 50,
        textAlign: "left"
    }
});

class Layout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialBunqJSClientRun: false
        };

        this.checkLanguageChange(this.props);

        if (this.minuteTimer) {
            clearInterval(this.minuteTimer);
        }
        this.minuteTimer = null;

        this.activityTimer = null;

        ipcRenderer.on("change-path", (event, path) => {
            const currentPath = this.props.history.location.pathname;

            if (currentPath !== path) {
                this.props.history.push(path);
            }
        });
        ipcRenderer.on("history-backward", (event, path) => {
            this.props.history.goBack();
        });
        ipcRenderer.on("history-forward", (event, path) => {
            this.props.history.goForward();
        });

        // keybind events from main process
        ipcRenderer.on("toggle-balance", event => {
            this.props.setHideBalance(!this.props.hideBalance);
        });
        ipcRenderer.on("trigger-queue-sync", event => {
            this.props.queueStartSync();
        });
        ipcRenderer.on("toggle-theme", event => {
            this.props.setTheme(this.props.theme === "DefaultTheme" ? "DarkTheme" : "DefaultTheme");
        });

        // access the translations globally
        window.t = this.props.t;

        // register mouse and network events
        window.onmousemove = this.onActivityEvent.bind(this);
        window.onkeypress = this.onActivityEvent.bind(this);

        this.props.registrationLoadBunqDesktopClient();
    }

    componentDidMount() {
        this.props.BunqJSClient.run(false)
            .then(_ => {})
            .catch(error => {});

        if (process.env.NODE_ENV !== "development") {
            VersionChecker().then(versionInfo => {
                if (versionInfo.newerLink !== false) {
                    this.props.openSnackbar(
                        `A new version (v${versionInfo.latestVersion}) is available! You are currently using ${versionInfo.currentVersion}`,
                        8000
                    );
                }
            });
        }

        // set initial timeout trigger
        this.setActivityTimeout();

        // setup minute timer
        this.checkTime();
        this.minuteTimer = setInterval(this.checkTime, 5000);
    }

    componentWillUpdate(nextProps) {
        // make sure language is up-to-date
        this.checkLanguageChange(nextProps);

        if (nextProps.theme === "DefaultTheme") {
            if (document.documentElement.style.backgroundColor !== "#fafafa") {
                document.documentElement.style.backgroundColor = "#fafafa";
            }
        } else {
            if (document.documentElement.style.backgroundColor !== "#303030") {
                document.documentElement.style.backgroundColor = "#303030";
            }
        }

        if (nextProps.apiKey !== this.props.apiKey || nextProps.environment !== this.props.environment) {
            if (this.props.apiKey !== false) {
                // clear our old data associated with the previous session
                this.props.registrationClearUserInfo();
            }
        }

        return true;
    }

    /**
     * Checks if the language chanaged and update i18n when required
     * @param newProps
     */
    checkLanguageChange = newProps => {
        const { i18n } = this.props;
        if (newProps.language !== this.props.language || newProps.i18n.language !== this.props.language) {
            // update back-end language
            ipcRenderer.send("change-language", newProps.language);

            // change client-side langauge
            i18n.changeLanguage(newProps.language);
        }
    };

    /**
     * Checks if automaticThemeChange is enabled and switches theme based on time
     */
    checkTime = () => {
        if (this.props.automaticThemeChange) {
            const currentTime = new Date().getTime();

            const morningDate = new Date();
            morningDate.setHours(8);
            morningDate.setMinutes(30);
            morningDate.setSeconds(0);
            morningDate.setMilliseconds(0);
            const morningTime = morningDate.getTime();

            const nightDate = new Date();
            nightDate.setHours(19);
            nightDate.setMinutes(30);
            nightDate.setSeconds(0);
            nightDate.setMilliseconds(0);
            const nightTime = nightDate.getTime();

            if (currentTime > morningTime && currentTime < nightTime) {
                if (this.props.theme === "DarkTheme") {
                    this.props.setTheme("DefaultTheme");
                }
            } else {
                if (this.props.theme === "DefaultTheme") {
                    this.props.setTheme("DarkTheme");
                }
            }
        }
    };

    onActivityEvent = e => {
        if (this.props.checkInactivity) {
            this.clearActivityTimeout();
            this.setActivityTimeout();
        } else {
            this.clearActivityTimeout();
        }
    };

    setActivityTimeout = () => {
        this.activityTimer = setTimeout(() => {
            // check if option is still enabled
            if (this.props.checkInactivity) {
                // reload the app
                location.reload();
            }
            // time in seconds * 1000 for milliseconds
        }, this.props.inactivityCheckDuration * 1000);
    };

    clearActivityTimeout = () => {
        clearTimeout(this.activityTimer);
        this.activityTimer = null;
    };

    render() {
        const { classes } = this.props;
        const childProps = {
            // uniqueness to help with triggering route change animations
            key: this.props.location.pathname,
            // give all routes access to bunq-js-client
            BunqJSClient: this.props.BunqJSClient,
            // modal and snackbar helpers
            openModal: this.props.openModal,
            themeList: ThemeList,
            openSnackbar: this.props.openSnackbar,

            // helps all child components to prevent calls before the BunqJSClient is finished setting up
            registrationReady: this.props.registrationReady
        };
        const selectedTheme = ThemeList[this.props.theme]
            ? ThemeList[this.props.theme]
            : ThemeList[Object.keys(ThemeList)[0]];
        const strippedLocation = this.props.location.pathname.replace(/\W/g, "");

        const isLoading =
            this.props.paymentsLoading ||
            this.props.bunqMeTabsLoading ||
            this.props.masterCardActionsLoading ||
            this.props.requestInquiriesLoading ||
            this.props.requestResponsesLoading;

        const contentContainerClass = this.props.stickyMenu ? classes.contentContainerSticky : classes.contentContainer;
        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={selectedTheme}>
                <main className={classes.main}>
                    <RuleCollectionChecker updateToggle={isLoading} />
                    <NetworkStatusChecker />

                    <QueueManager BunqJSClient={this.props.BunqJSClient} />

                    <Header BunqJSClient={this.props.BunqJSClient} />
                    <Sidebar BunqJSClient={this.props.BunqJSClient} location={this.props.location} />
                    <Grid
                        container
                        spacing={16}
                        justify={"center"}
                        className={`${contentContainerClass} ${strippedLocation}-page`}
                        style={{
                            backgroundColor: selectedTheme.palette.background.default,
                            padding: 16
                        }}
                    >
                        <MainDialog />
                        <MainSnackbar />

                        <Grid item xs={12}>
                            <ErrorBoundary recoverableError={true} history={this.props.history}>
                                <RouteComponent
                                    apiKey={this.props.apiKey}
                                    userType={this.props.userType}
                                    derivedPassword={this.props.derivedPassword}
                                    childProps={childProps}
                                />
                            </ErrorBoundary>
                        </Grid>
                    </Grid>
                </main>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme,
        language: state.options.language,
        stickyMenu: state.options.sticky_menu,
        hideBalance: state.options.hide_balance,
        checkInactivity: state.options.check_inactivity,
        automaticThemeChange: state.options.automatic_theme_change,
        inactivityCheckDuration: state.options.inactivity_check_duration,

        derivedPassword: state.registration.derived_password,
        registrationIsLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        permittedIps: state.registration.permitted_ips,
        apiKey: state.registration.api_key,
        registrationReady: state.registration.ready,

        user: state.user.user,
        userType: state.user.user_type,
        userInitialCheck: state.user.initialCheck,
        userLoading: state.user.loading,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        masterCardActionsLoading: state.master_card_actions.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: (message, duration = 4000) => dispatch(openSnackbar(message, duration)),
        openModal: (message, title) => dispatch(openModal(message, title)),
        BunqErrorHandler: (error, customError = false) => BunqErrorHandler(dispatch, error, customError),

        // options
        setAutomaticThemeChange: automaticThemeChange => dispatch(setAutomaticThemeChange(automaticThemeChange)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        setTheme: theme => dispatch(setTheme(theme)),

        queueStartSync: () => dispatch(queueStartSync()),

        // functions to clear user data
        registrationClearUserInfo: () => dispatch(registrationClearUserInfo()),

        registrationLoadBunqDesktopClient: () => dispatch(registrationSetBunqDesktopClientData())
    };
};

export default withStyles(styles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Layout)))
);

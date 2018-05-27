import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ipcRenderer } from "electron";

// custom components
import Logger from "../Helpers/Logger";
import VersionChecker from "../Helpers/VersionChecker";
import NetworkStatusChecker from "./NetworkStatusChecker";
import RuleCollectionChecker from "./RuleCollectionChecker";
import MainDialog from "./MainDialog";
import MainSnackbar from "./MainSnackbar";
import MainDrawer from "./MainDrawer";
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
import { userLogin } from "../Actions/user.js";
import { usersUpdate } from "../Actions/users";
import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import { loadStoredPayments } from "../Actions/payments";
import { loadStoredAccounts } from "../Actions/accounts";
import { loadStoredBunqMeTabs } from "../Actions/bunq_me_tabs";
import { applicationSetStatus } from "../Actions/application.js";
import {
    registrationClearUserInfo,
    registrationResetToApiScreenSoft
} from "../Actions/registration";
import { loadStoredMasterCardActions } from "../Actions/master_card_actions";
import { loadStoredRequestInquiries } from "../Actions/request_inquiries";
import { loadStoredRequestResponses } from "../Actions/request_responses";
import {
    registrationLoading,
    registrationNotLoading,
    registrationResetToApiScreen
} from "../Actions/registration";
import {
    setHideBalance,
    setTheme,
    setAutomaticThemeChange
} from "../Actions/options";
import { loadStoredContacts } from "../Actions/contacts";
import { loadStoredShareInviteBankResponses } from "../Actions/share_invite_bank_response";
import { loadStoredShareInviteBankInquiries } from "../Actions/share_invite_bank_inquiry";

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
            initialBunqConnect: false
        };

        this.activityTimer = null;
        this.minuteTimer = null;

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
        ipcRenderer.on("toggle-theme", event => {
            this.props.setTheme(
                this.props.theme === "DefaultTheme"
                    ? "DarkTheme"
                    : "DefaultTheme"
            );
        });

        // access the translations globally
        window.t = this.props.t;

        // register mouse and network events
        window.onmousemove = this.onActivityEvent.bind(this);
        window.onkeypress = this.onActivityEvent.bind(this);
    }

    componentDidMount() {
        this.checkBunqSetup()
            .then(_ => {
                if (this.props.userType !== false) {
                    // if a usertype is selected, we try to login the user
                    this.props.userLogin(this.props.userType, false);
                }
            })
            .catch(Logger.error);

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

    componentWillMount() {
        this.checkLanguageChange(this.props);

        // unset the minuteTimer when set
        if (this.minuteTimer) clearInterval(this.minuteTimer);
        this.minuteTimer = null;
    }

    componentWillUpdate(nextProps) {
        // make sure language is up-to-date
        this.checkLanguageChange(nextProps);

        if (
            nextProps.apiKey !== this.props.apiKey ||
            nextProps.environment !== this.props.environment
        ) {
            if (this.props.apiKey !== false) {
                // clear our old data associated with the previous session
                this.props.registrationClearUserInfo();
            }

            this.checkBunqSetup(nextProps)
                .then(_ => {})
                .catch(Logger.error);
        }

        return true;
    }

    /**
     * Checks if the language chanaged and update i18n when required
     * @param newProps
     */
    checkLanguageChange = newProps => {
        const { i18n } = this.props;
        if (
            newProps.language !== this.props.language ||
            newProps.i18n.language !== this.props.language
        ) {
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

    /**
     * Checks if the bunqjsclient needs to setup
     * @param nextProps
     * @returns {Promise<void>}
     */
    checkBunqSetup = async (nextProps = false) => {
        if (nextProps === false) {
            nextProps = this.props;
        }

        if (
            nextProps.apiKey === false &&
            this.state.initialBunqConnect === true
        ) {
            // api key not set but bunq connect is true so we reset it
            this.setState({ initialBunqConnect: true });
        }

        // run only if apikey is not false or first setup AND the registration isnt already loading
        if (
            (this.state.initialBunqConnect === false ||
                nextProps.apiKey !== false) &&
            nextProps.registrationIsLoading === false
        ) {
            // registration is loading now
            nextProps.registrationLoading();

            // if we have a derivedPassword we use it to encrypt the bunqjsclient data
            const encryptionKey =
                nextProps.derivedPassword !== false
                    ? nextProps.derivedPassword.key
                    : false;

            // api key was modified
            return this.setupBunqClient(
                nextProps.apiKey,
                nextProps.deviceName,
                nextProps.environment,
                encryptionKey,
                true
            )
                .then(() => {
                    nextProps.registrationNotLoading();

                    // initial bunq connect has been done
                    this.setState({ initialBunqConnect: true });
                })
                .catch(setupError => {
                    Logger.error(setupError);
                    // installation failed so we reset the api key
                    nextProps.registrationResetToApiScreenSoft();
                    nextProps.registrationNotLoading();
                });
        }
    };

    /**
     * Setup the BunqJSClient
     * @param apiKey             - the bunq api key
     * @param deviceName         - device name used in the bunq app
     * @param environment        - Production/sandbox environment
     * @param encryptionKey      - Key used to encrypt/decrypt all data
     * @param allowReRun         - When true the function can call itself to restart in certain situations
     * @returns {Promise<void>}
     */
    setupBunqClient = async (
        apiKey,
        deviceName,
        environment = "SANDBOX",
        encryptionKey = false,
        allowReRun = false
    ) => {
        const t = this.props.t;
        const errorTitle = t("Something went wrong");
        const error1 = t("We failed to setup BunqDesktop properly");
        const error2 = t("We failed to install a new application");
        const error3 = t(
            "The API key or IP you are currently on is not valid for the selected bunq environment"
        );
        const error4 = t(
            "We failed to register this device on the bunq servers Are you sure you entered a valid API key? And are you sure that this key is meant for the selected bunq environment?"
        );
        const error5 = t(
            "We failed to create a new session! Your IP might have changed or the API key is no longer valid"
        );

        const statusMessage1 = t("Registering our encryption keys");
        const statusMessage2 = t("Installing this device");
        const statusMessage3 = t("Creating a new session");

        try {
            await this.props.BunqJSClient.run(
                apiKey,
                [],
                environment,
                encryptionKey
            );
        } catch (exception) {
            this.props.openModal(error1, errorTitle);
            throw exception;
        }

        if (apiKey === false) {
            // no api key yet so nothing else to do just yet
            return;
        }

        this.props.applicationSetStatus(statusMessage1);
        try {
            await this.props.BunqJSClient.install();
        } catch (exception) {
            this.props.openModal(error2, errorTitle);
            throw exception;
        }

        this.props.applicationSetStatus(statusMessage2);
        try {
            await this.props.BunqJSClient.registerDevice(deviceName);
        } catch (exception) {
            if (exception.response && exception.response.data.Error[0]) {
                const responseError = exception.response.data.Error[0];
                if (
                    responseError.error_description ===
                    "User credentials are incorrect. Incorrect API key or IP address."
                ) {
                    this.props.openModal(error3, errorTitle);
                    throw exception;
                }
            }
            this.props.openModal(error4, errorTitle);
            throw exception;
        }

        this.props.applicationSetStatus(statusMessage3);
        try {
            await this.props.BunqJSClient.registerSession();
        } catch (exception) {
            this.props.openModal(error5, errorTitle);

            // custom error handling to prevent
            if (exception.errorCode) {
                switch (exception.errorCode) {
                    case this.props.BunqJSClient.errorCodes
                        .INSTALLATION_HAS_SESSION:
                        Logger.error(
                            `Error while creating a new session: ${exception.errorCode}`
                        );

                        if (allowReRun) {
                            // this might be solved by reseting the bunq client
                            await BunqJSClient.destroyApiSession();

                            // try one re-run but with allowReRun false this time
                            await this.setupBunqClient(
                                apiKey,
                                deviceName,
                                environment,
                                encryptionKey,
                                false
                            );
                            return;
                        }

                        break;
                    default:
                        // just log the error
                        Logger.error(exception);
                        break;
                }
            }
            throw exception;
        }

        this.props.loadStoredAccounts();
        this.props.loadStoredContacts();
        this.props.loadStoredPayments();
        this.props.loadStoredBunqMeTabs();
        this.props.loadStoredMasterCardActions();
        this.props.loadStoredRequestInquiries();
        this.props.loadStoredRequestResponses();
        this.props.loadStoredShareInviteBankResponses();
        this.props.loadStoredShareInviteBankInquiries();

        // setup finished with no errors
        this.props.applicationSetStatus("");
        this.props.usersUpdate(true);
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
            initialBunqConnect: this.state.initialBunqConnect
        };
        const selectedTheme = ThemeList[this.props.theme]
            ? ThemeList[this.props.theme]
            : ThemeList[Object.keys(ThemeList)[0]];
        const strippedLocation = this.props.location.pathname.replace(
            /\W/g,
            ""
        );

        const isLoading =
            this.props.paymentsLoading ||
            this.props.bunqMeTabsLoading ||
            this.props.masterCardActionsLoading ||
            this.props.requestInquiriesLoading ||
            this.props.requestResponsesLoading;

        const contentContainerClass = this.props.stickyMenu
            ? classes.contentContainerSticky
            : classes.contentContainer;
        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={selectedTheme}>
                <main className={classes.main}>
                    <RuleCollectionChecker updateToggle={isLoading} />
                    <NetworkStatusChecker />

                    <Header />
                    <MainDrawer
                        BunqJSClient={this.props.BunqJSClient}
                        location={this.props.location}
                    />
                    <Grid
                        container
                        spacing={16}
                        justify={"center"}
                        className={`${contentContainerClass} ${strippedLocation}-page`}
                        style={{
                            backgroundColor:
                                selectedTheme.palette.background.default,
                            padding: 16
                        }}
                    >
                        <MainDialog />
                        <MainSnackbar />

                        <Grid item xs={12}>
                            <ErrorBoundary
                                recoverableError={true}
                                history={this.props.history}
                            >
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

        derivedPassword: state.registration.derivedPassword,
        registrationIsLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,

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
        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration)),
        openModal: (message, title) => dispatch(openModal(message, title)),

        // options
        setAutomaticThemeChange: automaticThemeChange =>
            dispatch(setAutomaticThemeChange(automaticThemeChange)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        setTheme: theme => dispatch(setTheme(theme)),

        // set the current application status
        applicationSetStatus: status_message =>
            dispatch(applicationSetStatus(status_message)),

        registrationLoading: () => dispatch(registrationLoading()),
        registrationNotLoading: () => dispatch(registrationNotLoading()),
        registrationResetToApiScreen: () =>
            dispatch(registrationResetToApiScreen(BunqJSClient)),
        registrationResetToApiScreenSoft: () =>
            dispatch(registrationResetToApiScreenSoft(BunqJSClient)),

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated)),
        // login the user with a specific type from the list
        userLogin: (userType, updated = false) =>
            dispatch(userLogin(BunqJSClient, userType, updated)),

        loadStoredPayments: () => dispatch(loadStoredPayments(BunqJSClient)),
        loadStoredContacts: () => dispatch(loadStoredContacts(BunqJSClient)),
        loadStoredBunqMeTabs: () =>
            dispatch(loadStoredBunqMeTabs(BunqJSClient)),
        loadStoredMasterCardActions: () =>
            dispatch(loadStoredMasterCardActions(BunqJSClient)),
        loadStoredRequestInquiries: () =>
            dispatch(loadStoredRequestInquiries(BunqJSClient)),
        loadStoredAccounts: () => dispatch(loadStoredAccounts(BunqJSClient)),
        loadStoredRequestResponses: () =>
            dispatch(loadStoredRequestResponses(BunqJSClient)),
        loadStoredShareInviteBankResponses: () =>
            dispatch(loadStoredShareInviteBankResponses(BunqJSClient)),
        loadStoredShareInviteBankInquiries: () =>
            dispatch(loadStoredShareInviteBankInquiries(BunqJSClient)),

        // functions to clear user data
        registrationClearUserInfo: () => dispatch(registrationClearUserInfo())
    };
};

export default withStyles(styles, { withTheme: true })(
    withRouter(
        connect(mapStateToProps, mapDispatchToProps)(
            translate("translations")(Layout)
        )
    )
);

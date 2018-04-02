import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import createMuiTheme from "material-ui/styles/createMuiTheme";
import { ipcRenderer } from "electron";

// custom components
import Logger from "../Helpers/Logger";
import VersionChecker from "../Helpers/VersionChecker";
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
import { applicationSetStatus } from "../Actions/application.js";
import { userLogin } from "../Actions/user.js";
import { usersUpdate } from "../Actions/users";
import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import { registrationClearUserInfo } from "../Actions/registration";
import { loadStoredPayments } from "../Actions/payments";
import { loadStoredAccounts } from "../Actions/accounts";
import { loadStoredBunqMeTabs } from "../Actions/bunq_me_tabs";
import { loadStoredMasterCardActions } from "../Actions/master_card_actions";
import { loadStoredRequestInquiries } from "../Actions/request_inquiries";
import { loadStoredRequestResponses } from "../Actions/request_responses";
import {
    registrationLoading,
    registrationNotLoading,
    registrationClearApiKey
} from "../Actions/registration";
import { setHideBalance } from "../Actions/options";

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
        window.onmousemove = this.onActivityEvent.bind(this);
        window.onkeypress = this.onActivityEvent.bind(this);

        ipcRenderer.on("change-path", (event, path) => {
            const currentPath = this.props.history.location.pathname;

            if (currentPath !== path) {
                this.props.history.push(path);
            }
        });
        ipcRenderer.on("toggle-balance", (event, path) => {
            this.props.setHideBalance(!this.props.hideBalance);
        });
    }

    componentWillMount() {
        const { i18n, language } = this.props;
        i18n.changeLanguage(language);
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

        if (process.env.NODE_ENV !== "DEVELOPMENT") {
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

        if (process.env.NODE_ENV !== "development") {
            // compare pathnames and trigger a
            const nextUrl = nextProps.location.pathname;
            const currentUrl = this.props.location.pathname;
            if (nextUrl !== currentUrl) {
                // trigger analytics page event
                window.ga("set", "page", nextUrl);
                window.ga("send", "pageview");
            }
        }
        return true;
    }

    /**
     * Checks if the language chanaged and update i18n when required
     * @param newProps
     */
    checkLanguageChange = (newProps = false) => {
        const { i18n } = this.props;
        if (newProps === false || newProps.language !== this.props.language) {
            i18n.changeLanguage(newProps.language);
        }
    };

    checkBunqSetup = async (nextProps = false) => {
        if (nextProps === false) {
            nextProps = this.props;
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
                    nextProps.registrationClearApiKey();
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
        try {
            await this.props.BunqJSClient.run(
                apiKey,
                [],
                environment,
                encryptionKey
            );
        } catch (exception) {
            this.props.openModal(
                "We failed to setup BunqDesktop properly",
                "Something went wrong"
            );
            throw exception;
        }

        if (apiKey === false) {
            // no api key yet so nothing else to do just yet
            return;
        }

        this.props.applicationSetStatus("Registering our encryption keys");
        try {
            await this.props.BunqJSClient.install();
        } catch (exception) {
            this.props.openModal(
                "We failed to install a new application",
                "Something went wrong"
            );
            throw exception;
        }

        this.props.applicationSetStatus("Installing this device");
        try {
            await this.props.BunqJSClient.registerDevice(deviceName);
        } catch (exception) {
            if (exception.response && exception.response.data.Error[0]) {
                const responseError = exception.response.data.Error[0];
                if (
                    responseError.error_description ===
                    "User credentials are incorrect. Incorrect API key or IP address."
                ) {
                    this.props.openModal(
                        `The API key or IP you are currently on is not valid for the ${environment} bunq environment.`,
                        "Something went wrong"
                    );
                    throw exception;
                }
            }
            this.props.openModal(
                `We failed to register this device on the bunq servers. Are you sure you entered a valid API key? And are you sure that this key is meant for the ${environment} bunq environment?`,
                "Something went wrong"
            );
            throw exception;
        }

        this.props.applicationSetStatus("Creating a new session");
        try {
            await this.props.BunqJSClient.registerSession();
        } catch (exception) {
            this.props.openModal(
                "We failed to create a new session",
                "Something went wrong"
            );

            // custom error handling to prevent
            if (exception.errorCode) {
                switch (exception.errorCode) {
                    case BunqJSClient.errorCodes.INSTALLATION_HAS_SESSION:
                        Logger.error(
                            `Error while creating a new session: ${exception.errorCode}`
                        );

                        if (allowReRun) {
                            // this might be solved by reseting the bunq client
                            await BunqJSClient.destroySession();
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
        this.props.loadStoredPayments();
        this.props.loadStoredBunqMeTabs();
        this.props.loadStoredMasterCardActions();
        this.props.loadStoredRequestInquiries();
        this.props.loadStoredRequestResponses();

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

        const contentContainerClass = this.props.stickyMenu
            ? classes.contentContainerSticky
            : classes.contentContainer;
        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={selectedTheme}>
                <main className={classes.main}>
                    <Header />
                    <MainDrawer
                        BunqJSClient={this.props.BunqJSClient}
                        location={this.props.location}
                    />
                    <Grid
                        container
                        spacing={16}
                        justify={"center"}
                        className={`${contentContainerClass}  ${strippedLocation}-page`}
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
        inactivityCheckDuration: state.options.inactivity_check_duration,

        derivedPassword: state.registration.derivedPassword,
        registrationIsLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,

        user: state.user.user,
        userType: state.user.user_type,
        userInitialCheck: state.user.initialCheck,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration)),
        openModal: (message, title) => dispatch(openModal(message, title)),

        // set the current application status
        applicationSetStatus: status_message =>
            dispatch(applicationSetStatus(status_message)),

        registrationLoading: () => dispatch(registrationLoading()),
        registrationNotLoading: () => dispatch(registrationNotLoading()),
        registrationClearApiKey: () =>
            dispatch(registrationClearApiKey(BunqJSClient)),

        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated)),
        // login the user with a specific type from the list
        userLogin: (userType, updated = false) =>
            dispatch(userLogin(BunqJSClient, userType, updated)),

        loadStoredPayments: () => dispatch(loadStoredPayments(BunqJSClient)),
        loadStoredBunqMeTabs: () =>
            dispatch(loadStoredBunqMeTabs(BunqJSClient)),
        loadStoredMasterCardActions: () =>
            dispatch(loadStoredMasterCardActions(BunqJSClient)),
        loadStoredRequestInquiries: () =>
            dispatch(loadStoredRequestInquiries(BunqJSClient)),
        loadStoredAccounts: () => dispatch(loadStoredAccounts(BunqJSClient)),
        loadStoredRequestResponses: () =>
            dispatch(loadStoredRequestResponses(BunqJSClient)),

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

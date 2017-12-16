import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import createMuiTheme from "material-ui/styles/createMuiTheme";
import { ipcRenderer } from 'electron'

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
import { usersClear, usersUpdate } from "../Actions/users";
import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import {
    registrationLoading,
    registrationNotLoading,
    registrationClearApiKey
} from "../Actions/registration";
import OptionsDrawer from "./OptionsDrawer";

import { registrationClearUserInfo } from "../Actions/registration";

const styles = theme => ({
    contentContainer: {
        margin: 0,
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("md")]: {
            margin: 0,
            marginLeft: 250,
            width: "calc(100% - 250px)"
        }
    },
    main: { marginTop: 50, textAlign: "left" }
});

class Layout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            initialBunqConnect: false
        };


        ipcRenderer.on('change-path', (event, path) => {
            const currentPath = this.props.history.location.pathname;

            if (currentPath !== path) {
                this.props.history.push(path);
            }
        });
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

        VersionChecker().then(versionInfo => {
            if (versionInfo.newerLink !== false) {
                this.props.openSnackbar(
                    `A new version (v${versionInfo.latestVersion}) is available! You are currently using ${versionInfo.currentVersion}`,
                    8000
                );
            }
        });
    }

    componentWillUpdate(nextProps) {
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
    }

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
                encryptionKey
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

    setupBunqClient = async (
        apiKey,
        deviceName,
        environment = "SANDBOX",
        encryptionKey = false
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

        this.props.applicationSetStatus("Registering our encryption keys...");
        try {
            await this.props.BunqJSClient.install();
        } catch (exception) {
            this.props.openModal(
                "We failed to install a new application",
                "Something went wrong"
            );
            throw exception;
        }

        this.props.applicationSetStatus("Installing this device...");
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

        this.props.applicationSetStatus("Creating a new session...");
        try {
            await this.props.BunqJSClient.registerSession();
        } catch (exception) {
            this.props.openModal(
                "We failed to create a new session",
                "Something went wrong"
            );
            throw exception;
        }

        // setup finished with no errors
        this.props.applicationSetStatus("");
        this.props.usersUpdate(true);
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
            openSnackbar: this.props.openSnackbar,
            // helps all child components to prevent calls before the BunqJSClietn is finished setting up
            initialBunqConnect: this.state.initialBunqConnect
        };

        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={ThemeList[this.props.theme]}>
                <main className={classes.main}>
                    <Header />
                    <MainDrawer />
                    <OptionsDrawer themeList={ThemeList} />
                    <Grid
                        container
                        spacing={16}
                        justify={"center"}
                        className={classes.contentContainer}
                        style={{
                            backgroundColor:
                                ThemeList[this.props.theme].palette.background
                                    .default,
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
        theme: state.theme.theme,

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

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated)),
        // login the user with a specific type from the list
        userLogin: (userType, updated = false) =>
            dispatch(userLogin(BunqJSClient, userType, updated)),

        // functions to clear user data
        registrationClearUserInfo: () => dispatch(registrationClearUserInfo()),
    };
};

export default withStyles(styles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))
);

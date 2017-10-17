import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Snackbar from "material-ui/Snackbar";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import createMuiTheme from "material-ui/styles/createMuiTheme";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

import Logger from "../Helpers/Logger";
import DefaultThemeConfig from "../Themes/DefaultTheme";
const DefaultTheme = createMuiTheme(DefaultThemeConfig);

// redux actions
import { userLogin } from "../Actions/user.js";
import { closeModal } from "../Actions/modal.js";
import { closeSnackbar, openSnackbar } from "../Actions/snackbar.js";
import { openModal } from "../Actions/modal";
import { usersClear, usersUpdate } from "../Actions/users";
import { registrationSetApiKey } from "../Actions/registration";
import { accountsClear } from "../Actions/accounts";
import { paymentInfoClear } from "../Actions/payment_info";
import { userClear } from "../Actions/user";

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.apiKey !== false) {
            this.props.BunqJSClient
                .run(this.props.apiKey, [], this.props.environment)
                .then(() => {
                    Logger.debug("Initial BunqJSClient setup finished");

                    this.props.usersUpdate();
                });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            (this.props.apiKey !== nextProps.apiKey ||
                this.props.environment !== nextProps.environment) &&
            nextProps.apiKey !== false
        ) {
            // clear our old data associated with the previous session
            this.props.clearAccounts();
            this.props.clearPaymentInfo();
            this.props.clearUsers();
            this.props.clearUser();

            // api key was modified
            this.setupBunqClient(
                nextProps.apiKey,
                nextProps.deviceName,
                nextProps.environment
            )
                .then(() => {
                    Logger.debug("Setup client for new api key");
                })
                .catch(setupError => {
                    Logger.error(setupError);
                });
        }
    }

    setupBunqClient = async (apiKey, deviceName, environment) => {
        try {
            await this.props.BunqJSClient.run(apiKey, [], environment);
        } catch (exception) {
            Logger.error(exception);
            this.props.openModal(
                "We failed to setup BunqDesktop properly",
                "Something went wrong"
            );
            return false;
        }

        try {
            await this.props.BunqJSClient.install();
        } catch (exception) {
            Logger.error(exception);
            this.props.openModal(
                "We failed to install a new application",
                "Something went wrong"
            );
            // installation failed so we reset the api key
            this.setApiKey(false);

            return false;
        }

        try {
            await this.props.BunqJSClient.registerDevice(deviceName);
        } catch (exception) {
            Logger.error(exception);
            this.props.openModal(
                `We failed to register this device on the Bunq servers. Are you sure you entered a valid API key? And are you sure that this key is meant for the ${environment} Bunq environment?`,
                "Something went wrong"
            );
            // installation failed so we reset the api key
            this.setApiKey(false);

            return false;
        }

        try {
            await this.props.BunqJSClient.registerSession();
        } catch (exception) {
            Logger.error(exception);
            this.props.openModal(
                "We failed to create a new session",
                "Something went wrong"
            );
            // installation failed so we reset the api key
            this.setApiKey(false);

            return false;
        }

        // setup finished with no errors
        this.props.usersUpdate();
    };

    render() {
        const childProps = {
            // uniqueness to help with triggering route change animations
            key: this.props.location.pathname,
            // give all routes access to bunq-js-client
            BunqJSClient: this.props.BunqJSClient,
            setupBunqClient: this.setupBunqClient,

            // modal and snackbar helpers
            openModal: this.props.openModal,
            openSnackbar: this.props.openSnackbar
        };

        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={DefaultTheme}>
                <Grid container spacing={16} justify={"center"}>
                    <Dialog
                        open={this.props.modalOpen}
                        transition={<Slide direction="up" />}
                        keepMounted
                        onRequestClose={this.props.closeModal}
                    >
                        <DialogTitle>{this.props.modalTitle}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.props.modalText}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.props.closeModal}
                                color="primary"
                            >
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={this.props.snackbarOpen}
                        message={this.props.snackbarMessage}
                        autoHideDuration={this.props.snackbarDuration}
                        onRequestClose={this.props.closeSnackbar}
                    />

                    <Grid item xs={12} md={10} lg={8}>
                        <RouteComponent
                            user={this.props.user}
                            childProps={childProps}
                        />
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = store => {
    return {
        apiKey: store.registration.api_key,
        environment: store.registration.environment,
        deviceName: store.registration.device_name,

        user: store.user.user,
        userInitialCheck: store.user.initialCheck,
        userLoading: store.user.loading,

        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,

        snackbarMessage: store.snackbar.message,
        snackbarDuration: store.snackbar.duration,
        snackbarOpen: store.snackbar.snackbarOpen
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        closeSnackbar: () => dispatch(closeSnackbar()),
        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration)),

        closeModal: () => dispatch(closeModal()),
        openModal: (message, title) => dispatch(openModal(message, title)),

        // selects an account from the BunqJSClient user list based on type
        loginUser: type => dispatch(userLogin(BunqJSClient, type)),

        // set the api key for this app
        setApiKey: apiKey =>
            dispatch(registrationSetApiKey(BunqJSClient, apiKey)),

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated)),

        clearAccounts: () => dispatch(accountsClear()),
        clearPaymentInfo: () => dispatch(paymentInfoClear()),
        clearUsers: () => dispatch(usersClear()),
        clearUser: () => dispatch(userClear())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

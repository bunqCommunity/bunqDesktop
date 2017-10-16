import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import createMuiTheme from "material-ui/styles/createMuiTheme";
import Logger from "../Helpers/Logger";

import DefaultThemeConfig from "../Themes/DefaultTheme";

const DefaultTheme = createMuiTheme(DefaultThemeConfig);

// redux actions
import { userLogin } from "../Actions/user.js";
import { closeModal } from "../Actions/modal.js";
import { closeSnackbar, openSnackbar } from "../Actions/snackbar.js";
import { openModal } from "../Actions/modal";
import { usersUpdate } from "../Actions/users";

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        this.props.BunqJSClient.run(this.props.apiKey).then(() => {
            Logger.debug("Initial BunqJSClient setup finished");

            this.props.usersUpdate();
            // if (this.props.user !== false) {
            //     Logger.debug("Logging in selected user");
            //     // refresh user to make sure it is still available
            //     this.props.loginUser(this.props.user.type);
            // }
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            this.props.apiKey !== nextProps.apiKey &&
            nextProps.apiKey !== false
        ) {
            // api key was modified
            this.setupBunqClient(
                nextProps.apiKey,
                nextProps.deviceName
            ).then(() => {
                Logger.debug("Setup client for new api key");
            });
        }
    }

    setupBunqClient = async (apiKey, deviceName) => {
        try {
            await this.props.BunqJSClient.run(apiKey);
        } catch (exception) {
            Logger.log(exception);
            return false;
        }
        try {
            await this.props.BunqJSClient.install();
        } catch (exception) {
            Logger.log(exception);
            return false;
        }
        try {
            await this.props.BunqJSClient.registerDevice(deviceName);
        } catch (exception) {
            Logger.log(exception);
            return false;
        }
        try {
            await this.props.BunqJSClient.registerSession();
        } catch (exception) {
            Logger.log(exception);
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
                        title={this.props.modalTitle}
                        actions={[
                            <Button
                                flat
                                label="Ok"
                                primary={true}
                                keyboardFocused={true}
                                onTouchTap={this.props.closeModal}
                            />
                        ]}
                        modal={false}
                        open={this.props.modalOpen}
                        onRequestClose={this.props.closeModal}
                    >
                        {this.props.modalText}
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

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

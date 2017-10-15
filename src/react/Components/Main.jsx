import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import createMuiTheme from "material-ui/styles/createMuiTheme";

import DefaultThemeConfig from "../Themes/DefaultTheme";
const DefaultTheme = createMuiTheme(DefaultThemeConfig);

// move to remote npm later
import BunqJSClient from "../../../../BunqJSClient/index";

// redux actions
import { userLogin } from "../Actions/user.js";
import { closeModal } from "../Actions/modal.js";
import { closeSnackbar, openSnackbar } from "../Actions/snackbar.js";
import { openModal } from "../Actions/modal";

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.user !== false) {
            // refresh user to make sure it is still available
            this.props.loginUser(this.props.user.id, this.props.user.type);
        }

        this.BunqJSClient = new BunqJSClient(this.props.dispatch);
    }

    async setupBunqClient() {
        await this.BunqJSClient.run(this.props.apiKey);

        await this.BunqJSClient.install();

        await this.BunqJSClient.registerDevice(this.props.deviceName);

        await this.BunqJSClient.registerSession();
    }

    render() {
        const childProps = {
            // uniqueness to help with triggering route change animations
            key: this.props.location.pathname,
            // give all routes access to bunq-js-client
            BunqJSClient: this.BunqJSClient,

            // modal and snackbar helpers
            openModal: this.props.openModal,
            openSnackbar: this.props.openSnackbar
        };

        const RouteComponent = this.props.routesComponent;
        return (
            <MuiThemeProvider theme={DefaultTheme}>
                <Grid container spacing={24} justify={"center"}>
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

const mapDispatchToProps = dispatch => {
    return {
        closeSnackbar: () => dispatch(closeSnackbar()),
        openSnackbar: (message, duration = 4000) =>
            dispatch(openSnackbar(message, duration)),

        closeModal: () => dispatch(closeModal()),
        openModal: (message, title) => dispatch(openModal(message, title)),

        loginUser: (id, type) => dispatch(userLogin(id, type)),
        dispatch
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

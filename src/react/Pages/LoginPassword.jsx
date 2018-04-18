import React from "react";
import { translate } from "react-i18next";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Helmet from "react-helmet";
import store from "store";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import Card, { CardContent } from "material-ui/Card";
import { CircularProgress } from "material-ui/Progress";

import BuildIcon from "@material-ui/icons/Build";
import LockIcon from "@material-ui/icons/Lock";
import DesktopIcon from "@material-ui/icons/DesktopMac";

import TranslateButton from "../Components/TranslationHelpers/Button";

import {
    registrationLogOut,
    registrationSetDeviceName,
    registrationSetEnvironment,
    registrationUseNoPassword,
    registrationUsePassword
} from "../Actions/registration";

const styles = {
    wrapperContainer: {
        height: "100%"
    },
    warningCard: {
        marginTop: 16
    },
    loginButton: {
        width: "100%"
    },
    secondaryButtons: {
        width: "100%"
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    passwordInput: {
        color: "#000000",
        width: "100%",
        marginTop: 20
    },
    environmentToggle: {
        marginTop: 10
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    cardContent: {
        textAlign: "center",
        backgroundColor: "#ffffff"
    },
    girlSvg: {
        zIndex: 0,
        position: "fixed",
        right: 0,
        bottom: 0,
        height: "50%",
        maxWidth: "35%"
    },
    text: {
        color: "#000000"
    }
};

class LoginPassword extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            password: "",
            passwordValid: false,

            hasReadWarning: !!store.get("HAS_READ_DEV_WARNING")
        };
    }

    componentDidMount() {
        if (this.props.hasStoredApiKey) {
            // we have a stored api key
            if (this.props.useNoPassword) {
                // login with default password
                this.props.useNoPasswordLogin();
            }
        }
    }

    setRegistration = () => {
        if (this.state.password.length < 7) {
            this.props.openSnackbar(
                "The password you entered should be atleast 7 characters long!"
            );
            return;
        }

        if (this.state.passwordValid) {
            this.props.usePasswordLogin(this.state.password);
            this.setState({ password: "", passwordValid: false });
        }
    };

    handlePasswordChange = event => {
        const targetValue = event.target.value;
        this.setState({
            password: targetValue
        });
        this.validateInputs(targetValue);
    };

    validateInputs = password => {
        this.setState({
            passwordValid: password && password.length >= 7
        });
    };

    logOut = () => {
        this.props.logOut();
    };

    ignoreWarning = event => {
        store.set("HAS_READ_DEV_WARNING", true);
        this.setState({ hasReadWarning: true });
    };

    render() {
        const {
            status_message,
            registrationLoading,
            hasStoredApiKey,
            useNoPassword,
            derivedPassword,
            t
        } = this.props;
        const { passwordValid, hasReadWarning } = this.state;

        if (derivedPassword !== false) {
            return <Redirect to="/login" />;
        }

        const buttonDisabled =
            passwordValid === false || registrationLoading === true;

        let cardContent = null;

        if (hasReadWarning === false && registrationLoading === false) {
            cardContent = (
                <Card style={styles.warningCard}>
                    <CardContent>
                        <Typography variant="headline">
                            <DesktopIcon /> BunqDesktop
                        </Typography>
                        <Typography variant="body2">
                            {t("LoginBunqDesktopWarning")}
                        </Typography>
                        <br />

                        <Typography variant="headline">
                            <BuildIcon /> Development
                        </Typography>
                        <Typography variant="body2">
                            {t("LoginActiveDevelopmentWarning")}
                        </Typography>
                        <br />

                        <Typography variant="headline">
                            <LockIcon /> Password
                        </Typography>
                        <Typography variant="body2">
                            {t("LoginPasswordWarningPart1")}
                        </Typography>
                        <Typography variant="body2">
                            {t("LoginPasswordWarningPart2")}
                        </Typography>
                        <div style={{ textAlign: "center" }}>
                            <TranslateButton
                                variant={"raised"}
                                style={{ marginTop: 12 }}
                                onClick={this.ignoreWarning}
                            >
                                Don't show this again
                            </TranslateButton>
                        </div>
                    </CardContent>
                </Card>
            );
        } else {
            const passwordInputError =
                !passwordValid && this.state.password.length > 0;

            // actual content
            cardContent = registrationLoading ? (
                <CardContent style={styles.cardContent}>
                    <Typography
                        variant="headline"
                        component="h2"
                        style={styles.text}
                    >
                        Loading
                    </Typography>
                    <CircularProgress size={50} />
                    <Typography variant="subheading">
                        {status_message}
                    </Typography>
                </CardContent>
            ) : (
                <CardContent style={styles.cardContent}>
                    <Input
                        autoFocus
                        style={styles.passwordInput}
                        error={passwordInputError}
                        type="password"
                        label="Password"
                        className={
                            passwordInputError ? (
                                "password-input-error"
                            ) : (
                                "text-input"
                            )
                        }
                        placeholder={
                            hasStoredApiKey ? (
                                t("Enter your password")
                            ) : (
                                t("Enter a password")
                            )
                        }
                        onChange={this.handlePasswordChange}
                        onKeyPress={ev => {
                            if (
                                ev.key === "Enter" &&
                                buttonDisabled === false
                            ) {
                                this.setRegistration();
                                ev.preventDefault();
                            }
                        }}
                        value={this.state.password}
                    />

                    <Grid
                        container
                        spacing={16}
                        justify="center"
                        style={{ marginTop: 16 }}
                    >
                        {hasStoredApiKey ? (
                            <Grid item xs={6} sm={4}>
                                <TranslateButton
                                    variant="raised"
                                    className="white-button"
                                    style={styles.secondaryButtons}
                                    onClick={this.logOut}
                                >
                                    Logout
                                </TranslateButton>
                            </Grid>
                        ) : null}

                        {(hasStoredApiKey === true && useNoPassword === true) ||
                        hasStoredApiKey === false ? (
                            <React.Fragment>
                                <Grid item xs={6} sm={4} />
                                <Grid item xs={6} sm={4}>
                                    <TranslateButton
                                        variant="raised"
                                        className="white-button"
                                        style={styles.secondaryButtons}
                                        onClick={this.props.useNoPasswordLogin}
                                    >
                                        Skip
                                    </TranslateButton>
                                </Grid>
                            </React.Fragment>
                        ) : (
                            <Grid item xs={6} sm={4} />
                        )}

                        <Grid item xs={12} sm={4}>
                            <TranslateButton
                                variant="raised"
                                color="primary"
                                className="black-button"
                                disabled={buttonDisabled}
                                style={styles.loginButton}
                                onClick={this.setRegistration}
                            >
                                Login
                            </TranslateButton>
                        </Grid>
                    </Grid>
                </CardContent>
            );
        }

        return (
            <Grid
                container
                spacing={16}
                justify={"center"}
                alignItems={"center"}
                style={styles.wrapperContainer}
            >
                <Helmet>
                    <title>{`BunqDesktop - ${t("Password Setup")}`}</title>
                </Helmet>

                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    lg={4}
                    style={{ zIndex: 1 }}
                    className="animated zoomIn"
                >
                    <div>{cardContent}</div>
                </Grid>

                <img
                    className="animated fadeInRight"
                    src="images/svg/girl.svg"
                    style={styles.girlSvg}
                />
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        status_message: state.application.status_message,

        hasStoredApiKey: state.registration.has_stored_api_key,
        useNoPassword: state.registration.use_no_password,
        derivedPassword: state.registration.derivedPassword,
        registrationLoading: state.registration.loading,

        users: state.users.users,
        user: state.user.user,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // use no password
        useNoPasswordLogin: () => dispatch(registrationUseNoPassword()),
        // use password
        usePasswordLogin: password =>
            dispatch(registrationUsePassword(password)),

        // clear api key from bunqjsclient and bunqdesktop
        logOut: () => dispatch(registrationLogOut(BunqJSClient)),

        setEnvironment: environment =>
            dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(LoginPassword)
);

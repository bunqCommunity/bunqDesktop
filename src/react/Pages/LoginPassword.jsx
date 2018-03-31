import React from "react";
import { translate } from "react-i18next";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Helmet from "react-helmet";
import store from "store";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Card, { CardContent } from "material-ui/Card";
import { CircularProgress } from "material-ui/Progress";

import WarningIcon from "material-ui-icons/Warning";
import LockIcon from "material-ui-icons/Lock";

import TranslateButton from "../Components/TranslationHelpers/Button";

import {
    registrationClearApiKey,
    registrationSetApiKey,
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
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    passwordInput: {
        width: "100%",
        marginTop: 20
    },
    environmentToggle: {
        marginTop: 10
    },
    smallAvatar: {
        width: 50,
        height: 50
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

    clearApiKey = () => {
        this.props.clearApiKey();
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

        if (derivedPassword !== false) {
            return <Redirect to="/login" />;
        }

        const buttonDisabled =
            this.state.passwordValid === false || registrationLoading === true;

        let cardContent = null;

        if (this.state.hasReadWarning === false) {
            cardContent = (
                <Card style={styles.warningCard}>
                    <CardContent>
                        <Typography variant="headline">
                            <WarningIcon /> Caution!
                        </Typography>
                        <Typography variant="body2">
                            {t("ActiveDevelopmentWarning")}
                        </Typography>
                        <br />
                        <Typography variant="headline">
                            <LockIcon /> Password
                        </Typography>
                        <Typography variant="body2">
                            {t("PasswordWarningPart1")}
                        </Typography>
                        <Typography variant="body2">
                            {t("PasswordWarningPart2")}
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
            // actual content
            cardContent = registrationLoading ? (
                <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="headline" component="h2">
                        Loading
                    </Typography>
                    <CircularProgress size={50} />
                    <Typography variant="subheading">
                        {status_message}
                    </Typography>
                </CardContent>
            ) : (
                <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="headline" component="h2">
                        {hasStoredApiKey ? (
                            t("Enter your password")
                        ) : (
                            t("Enter a password")
                        )}
                    </Typography>

                    <Input
                        autoFocus
                        style={styles.passwordInput}
                        error={!this.state.passwordValid}
                        type="password"
                        label="Password"
                        hint="A secure 7+ character password"
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
                        <Grid item xs={6}>
                            <TranslateButton
                                variant="raised"
                                disabled={buttonDisabled}
                                color={"primary"}
                                style={styles.loginButton}
                                onClick={this.setRegistration}
                            >
                                Login
                            </TranslateButton>
                        </Grid>

                        {hasStoredApiKey ? (
                            <Grid item xs={6}>
                                <TranslateButton
                                    variant="raised"
                                    color={"secondary"}
                                    style={styles.loginButton}
                                    onClick={this.clearApiKey}
                                >
                                    Logout
                                </TranslateButton>
                            </Grid>
                        ) : null}

                        {(hasStoredApiKey === true && useNoPassword === true) ||
                        hasStoredApiKey === false ? (
                            <Grid item xs={6}>
                                <TranslateButton
                                    variant="raised"
                                    color={"secondary"}
                                    style={styles.loginButton}
                                    onClick={this.props.useNoPasswordLogin}
                                >
                                    Use no password
                                </TranslateButton>
                            </Grid>
                        ) : null}
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

                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card>{cardContent}</Card>
                </Grid>
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
        useNoPasswordLogin: password => dispatch(registrationUseNoPassword()),
        // use password
        usePasswordLogin: password =>
            dispatch(registrationUsePassword(password)),

        // clear api key from bunqjsclient and bunqdesktop
        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),
        // set the api key and stores the encrypted version
        setApiKey: api_key => dispatch(registrationSetApiKey(api_key)),

        setEnvironment: environment =>
            dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(LoginPassword)
);

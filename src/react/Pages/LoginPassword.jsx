import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Helmet from "react-helmet";
import store from "store";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
    passwordVisibilityIcon: {
        color: "#4c4c4c"
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
    formControl: {
        width: "100%"
    },
    text: {
        color: "#000000"
    },
    capslockWarning: {
        color: "#FF0000"
    }
};

class LoginPassword extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            password: "",
            passwordValid: false,
            passwordRepeat: "",
            passwordRepeatValid: false,
            showPassword: false,
            showPasswordRepeat: false,
            capslockWarningDisplay: false,

            hasReadWarning: !!store.get("HAS_READ_DEV_WARNING2")
        };

        this.passwordInput = React.createRef();
        this.passwordRepeatInput = React.createRef();
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
        const { hasStoredApiKey, storedApiKeys } = this.props;
        const { password, passwordValid, passwordRepeatValid } = this.state;
        if (password.length < 7) {
            this.props.openSnackbar("The password you entered should be atleast 7 characters long!");
            return;
        }

        const isExistingInstallation = hasStoredApiKey || (storedApiKeys && storedApiKeys.length > 0);

        // main password field is valid
        if (passwordValid) {
            // there are stored keys or second password is valid
            if (isExistingInstallation || passwordRepeatValid) {
                this.props.usePasswordLogin(password);
                this.setState({ password: "", passwordValid: false });
            }
        }
    };

    handlePasswordChange = event => {
        const targetValue = event.target.value;
        this.setState(
            {
                password: targetValue
            },
            this.validateInputs
        );
    };
    handlePasswordChangeRepeat = event => {
        const targetValue = event.target.value;
        this.setState(
            {
                passwordRepeat: targetValue
            },
            this.validateInputs
        );
    };

    handleKeyEvent = event => {
        if (this.isCapslockEnabled(event) === true) {
            this.setState({ capslockWarningDisplay: true });
        } else {
            if (this.state.capslockWarningDisplay) {
                this.setState({ capslockWarningDisplay: false });
            }
        }
    };

    isCapslockEnabled = event => {
        return event.getModifierState("CapsLock");
    };

    toggleShowPassword = event => {
        this.setState({ showPassword: !this.state.showPassword });
        setTimeout(() => {
            this.passwordInput.focus();
            this.passwordInput.selectionStart = 1000;
            this.passwordInput.selectionEnd = 1000;
        }, 300);
    };
    toggleShowPasswordRepeat = event => {
        this.setState({ showPasswordRepeat: !this.state.showPasswordRepeat });
        setTimeout(() => {
            this.passwordRepeatInput.focus();
            this.passwordRepeatInput.selectionStart = 1000;
            this.passwordRepeatInput.selectionEnd = 1000;
        }, 300);
    };

    validateInputs = () => {
        const { password, passwordRepeat } = this.state;

        // check if password and repeat password are the same
        const samePassword = password === passwordRepeat;

        this.setState({
            passwordValid: password && password.length >= 7,
            passwordRepeatValid: samePassword
        });
    };

    logOut = () => {
        this.props.logOut();
    };

    render() {
        const {
            statusMessage,
            registrationLoading,
            hasStoredApiKey,
            storedApiKeys,
            useNoPassword,
            derivedPassword,
            analyticsEnabled,
            t
        } = this.props;
        const { passwordValid, passwordRepeatValid, hasReadWarning } = this.state;

        if (derivedPassword !== false) {
            return <Redirect to="/login" />;
        }
        if (hasReadWarning === false || typeof analyticsEnabled === "undefined") {
            return <Redirect to="/disclaimer" />;
        }

        const isExistingInstallation = hasStoredApiKey || (storedApiKeys && storedApiKeys.length > 0);

        const buttonDisabled =
            // invalid password
            passwordValid === false ||
            // no existing installation so repeat password is required
            (isExistingInstallation === false && passwordRepeatValid === false) ||
            // if loading we block disabled
            registrationLoading === true;

        let cardContent = registrationLoading ? (
            <CardContent style={styles.cardContent}>
                <Typography variant="headline" component="h2">
                    Loading
                </Typography>
                <CircularProgress size={50} />
                <Typography variant="subheading" style={styles.text}>
                    {statusMessage}
                </Typography>
            </CardContent>
        ) : (
            <CardContent style={styles.cardContent}>
                <Typography variant="headline" component="h2" style={styles.text}>
                    {isExistingInstallation ? t("Enter your password") : t("Enter a password")}
                </Typography>

                <FormControl style={styles.formControl}>
                    <InputLabel style={styles.text}>Password</InputLabel>
                    <Input
                        autoFocus
                        className={"text-input"}
                        inputRef={ref => (this.passwordInput = ref)}
                        style={styles.passwordInput}
                        onChange={this.handlePasswordChange}
                        error={!this.state.passwordValid}
                        value={this.state.password}
                        type={this.state.showPassword ? "text" : "password"}
                        onKeyPress={ev => {
                            this.handleKeyEvent(ev);
                            if (ev.key === "Enter" && buttonDisabled === false) {
                                this.setRegistration();
                                ev.preventDefault();
                            }
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.toggleShowPassword}
                                    onMouseDown={this.toggleShowPassword}
                                >
                                    {this.state.showPassword ? (
                                        <VisibilityOff style={styles.passwordVisibilityIcon} />
                                    ) : (
                                        <Visibility style={styles.passwordVisibilityIcon} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {isExistingInstallation ? null : (
                    <FormControl style={styles.formControl}>
                        <InputLabel>Password repeat</InputLabel>
                        <Input
                            className={"text-input"}
                            inputRef={ref => (this.passwordRepeatInput = ref)}
                            style={styles.passwordInput}
                            error={!this.state.passwordRepeatValid}
                            type={this.state.showPasswordRepeat ? "text" : "password"}
                            onChange={this.handlePasswordChangeRepeat}
                            value={this.state.passwordRepeat}
                            onKeyPress={ev => {
                                this.handleKeyEvent(ev);
                                if (ev.key === "Enter" && buttonDisabled === false) {
                                    this.setRegistration();
                                    ev.preventDefault();
                                }
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.toggleShowPasswordRepeat}
                                        onMouseDown={this.toggleShowPasswordRepeat}
                                    >
                                        {this.state.showPasswordRepeat ? (
                                            <VisibilityOff style={styles.passwordVisibilityIcon} />
                                        ) : (
                                            <Visibility style={styles.passwordVisibilityIcon} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                )}
                {this.state.capslockWarningDisplay ? (
                    <Typography
                        style={{
                            color: styles.capslockWarning.color
                        }}
                    >
                        {t("Capslock active")}
                    </Typography>
                ) : null}

                <Grid container spacing={16} justify="center" style={{ marginTop: 16 }}>
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

                    {(hasStoredApiKey === true && useNoPassword === true) || hasStoredApiKey === false ? (
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

        return (
            <Grid container spacing={16} justify={"center"} alignItems={"center"} style={styles.wrapperContainer}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Password Setup")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={8} md={5} lg={4} style={{ zIndex: 1 }} className="animated zoomIn login-wrapper">
                    <Card>{cardContent}</Card>
                </Grid>

                <img src="./images/svg/login-bg2.svg" id="login-background-image" />

                <span className="bunqdesktop-text-wrapper">
                    <span className="bunqdesktop-text-first">bunq</span>
                    <span className="bunqdesktop-text-second">Desktop</span>
                </span>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        statusMessage: state.application.status_message,

        analyticsEnabled: state.options.analytics_enabled,

        storedApiKeys: state.registration.stored_api_keys,
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
        usePasswordLogin: password => dispatch(registrationUsePassword(password)),

        // clear api key from bunqjsclient and bunqdesktop
        logOut: () => dispatch(registrationLogOut(BunqJSClient)),

        setEnvironment: environment => dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name => dispatch(registrationSetDeviceName(device_name))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(LoginPassword));

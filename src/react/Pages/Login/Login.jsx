import React from "react";
import { translate } from "react-i18next";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

import KeyIcon from "@material-ui/icons/VpnKey";

import QRSvg from "../../Components/QR/QRSvg";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import NavLink from "../../Components/Routing/NavLink";
import UserItem from "./UserItem";

import {
    registrationLogOut,
    registrationSetApiKey,
    registrationLoadApiKey,
    registrationSetDeviceName,
    registrationSetEnvironment
} from "../../Actions/registration";
import { userLogin } from "../../Actions/user";
import BunqErrorHandler from "../../Helpers/BunqErrorHandler";

const styles = {
    button: {
        width: "100%",
        marginTop: 20
    },
    apiInput: {
        width: "100%",
        marginTop: 20,
        color: "#000000"
    },
    environmentToggle: {
        marginTop: 10,
        color: "#000000"
    },
    wrapperContainer: {
        height: "100%"
    },
    qrCode: {
        width: 200,
        height: 200
    },
    optionsButton: {
        marginTop: 12,
        color: "#000000"
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    switchKeyIcon: {
        color: "#000000",
        marginLeft: 8
    },
    switchKeyButton: {
        color: "#000000",
        position: "absolute",
        top: 58,
        right: 8
    },
    valueInput: {
        color: "#000000"
    },
    card: {
        width: 250
    },
    cardContent: {
        backgroundColor: "#ffffff",
        textAlign: "center"
    },
    text: {
        color: "#000000"
    }
};

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            sandboxMode: false,
            apiKey: "",
            apiKeyValid: false,
            deviceName: "My Device",
            deviceNameValid: true,
            attemptingLogin: false,

            openOptions: false,

            loadingBunqUser: false,

            loadingQrCode: false,
            requestQrCodeBase64: false,
            requestUuid: false
        };
        this.displayQrCodeDelay = null;
        this.checkerInterval = null;
    }

    componentDidMount() {
        const isSandboxMode = this.props.environment === "SANDBOX";
        if (this.props.derivedPassword !== false) {
            this.props.loadApiKey(this.props.derivedPassword);
        }
        if (this.props.apiKey !== false) {
            this.setState({ apiKey: this.props.apiKey });
        }
        if (this.props.deviceName !== false) {
            this.setState({ deviceName: this.props.deviceName });
        }
        this.setState({
            // check if sandbox mode is set and open options if this is the case
            sandboxMode: isSandboxMode,
            openOptions: isSandboxMode
        });

        // check if only a single user is available
        this.checkForSingleUser();

        // validate inputs based on current input
        this.validateInputs(this.props.apiKey, this.props.deviceName);

        // set a timeout to let other stuff load first  before checking if we need to
        // display a qr code
        this.displayQrCodeDelay = setTimeout(() => {
            if (
                // currently no qr code set/being loaded
                this.state.loadingQrCode === false &&
                this.state.requestQrCodeBase64 === false &&
                //nothing is being loaded/set
                this.props.apiKey === false &&
                this.props.userLoading === false &&
                this.props.derivedPassword !== false &&
                this.props.registrationLoading === false
            ) {
                this.displayQrCode();
            }
        }, 500);
    }

    componentDidUpdate() {
        this.checkForSingleUser();
    }

    componentWillUnmount() {
        if (this.checkerInterval) clearInterval(this.checkerInterval);
        if (this.displayQrCodeDelay) clearTimeout(this.displayQrCodeDelay);
    }

    /**
     * Checks if only 1 user type is set and logs in the user if this is the case
     */
    checkForSingleUser = () => {
        const userTypes = Object.keys(this.props.users);
        if (userTypes.length === 1) {
            // only one user we can instantly log in, check requirements again
            if (
                this.props.derivedPassword !== false &&
                this.props.apiKey !== false &&
                this.props.deviceName !== false &&
                this.props.userLoading === false
            ) {
                this.props.loginUser(userTypes[0], true);
            }
        }
    };

    setRegistration = () => {
        const apiKeyLength = this.props.t(
            "The API key you entered does not look valid"
        );
        const deviceNameLengthMin = this.props.t(
            "The device name has to be atleast 1 character"
        );
        const deviceNameLengthMax = this.props.t(
            "The device name can't be longer than 32 characters"
        );

        if (this.state.apiKey.length !== 64) {
            this.props.openSnackbar(apiKeyLength);
            return;
        }

        if (this.state.deviceName.length <= 0) {
            this.props.openSnackbar(deviceNameLengthMin);
            return;
        } else if (this.state.deviceName.length > 32) {
            this.props.openSnackbar(deviceNameLengthMax);
            return;
        }

        if (this.state.deviceNameValid && this.state.apiKeyValid) {
            this.props.setDeviceName(this.state.deviceName);
            this.props.setEnvironment(
                this.state.sandboxMode ? "SANDBOX" : "PRODUCTION"
            );
            this.props.setApiKey(this.state.apiKey, this.props.derivedPassword);
        }
    };

    toggleOptionVisibility = () => {
        this.setState({ openOptions: !this.state.openOptions });
    };

    // create a new registration and display the qr code
    displayQrCode = () => {
        if (this.state.loadingQrCode === false) {
            this.setState({ loadingQrCode: true });

            this.props.BunqJSClient
                .createCredentials()
                .then(({ uuid, status, qr_base64 }) => {
                    this.setState({
                        loadingQrCode: false,
                        requestQrCodeBase64: qr_base64,
                        requestUuid: uuid
                    });

                    // start checking if the code was scanned
                    this.checkForScanEvent();
                })
                .catch(error => {
                    this.setState({
                        loadingQrCode: false
                    });
                    this.props.handleBunqError(error);
                });
        }
    };

    // create a new sandbox user
    createSandboxUser = () => {
        this.setState({ loadingBunqUser: true });
        this.props.BunqJSClient.api.sandboxUser
            .post()
            .then(apiKey => {
                // set the api key and update state
                this.setState(
                    {
                        apiKey: apiKey,
                        sandboxMode: true,
                        loadingBunqUser: false
                    },
                    // validate the new data
                    () =>
                        this.validateInputs(
                            this.state.apiKey,
                            this.state.deviceName
                        )
                );
            })
            .catch(error => {
                this.setState({ loadingBunqUser: false });
                this.props.handleBunqError(error);
            });
    };

    // check if the qr code has been scanned yet
    checkForScanEvent = () => {
        this.checkerInterval = setInterval(() => {
            if (this.state.requestUuid !== false) {
                this.props.BunqJSClient
                    .checkCredentialStatus(this.state.requestUuid)
                    .then(result => {
                        if (result.status === "ACCEPTED") {
                            this.setState(
                                {
                                    apiKey: result.api_key,
                                    requestQrCodeBase64: false,
                                    requestUuid: false
                                },
                                // validate the new data
                                () =>
                                    this.validateInputs(
                                        this.state.apiKey,
                                        this.state.deviceName,
                                        // trigger callback and check we can auto-login
                                        () => {
                                            // if options are open or sandbox mode is set we don't auto-login
                                            if (
                                                this.state.sandboxMode ===
                                                    false &&
                                                this.state.openOptions === false
                                            ) {
                                                this.setRegistration();
                                            }
                                        }
                                    )
                            );

                            // reset the check event
                            clearInterval(this.checkerInterval);
                        }
                    })
                    .catch(error => {
                        clearInterval(this.checkerInterval);
                        this.props.handleBunqError(error);
                    });
            }
        }, 5000);
    };

    logOut = () => {
        this.props.logOut();
        this.setState({ apiKey: "", apiKeyValid: false });
    };

    handleKeyChange = event => {
        this.setState(
            {
                apiKey: event.target.value
            },
            () => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleNameChange = event => {
        this.setState(
            {
                deviceName: event.target.value
            },
            () => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleCheckboxChange = (event, checked) => {
        this.setState({ sandboxMode: checked });
    };

    validateInputs = (apiKey, deviceName, cb = () => {}) => {
        this.setState(
            {
                apiKeyValid: apiKey !== false && apiKey.length === 64,
                deviceNameValid:
                    deviceName !== false &&
                    deviceName.length >= 1 &&
                    deviceName.length <= 32
            },
            cb
        );
    };

    render() {
        const {
            t,
            users,
            status_message,
            userLoading,
            usersLoading,
            BunqJSClient
        } = this.props;

        if (
            this.props.derivedPassword === false &&
            this.props.registrationLoading === false
        ) {
            return <Redirect to="/password" />;
        } else if (
            this.props.derivedPassword !== false &&
            this.props.apiKey !== false &&
            this.props.userType !== false &&
            this.props.registrationLoading === false
        ) {
            // we have the required data and registration is no longer setting up
            return <Redirect to="/" />;
        }

        const userItems =
            userLoading || usersLoading ? (
                <Grid item xs={12}>
                    <CardContent style={{ textAlign: "center" }}>
                        <TranslateTypography variant="headline" component="h2">
                            Loading user accounts
                        </TranslateTypography>
                        <CircularProgress size={50} />
                    </CardContent>
                </Grid>
            ) : (
                Object.keys(users).map(userKey => (
                    <UserItem
                        BunqJSClient={BunqJSClient}
                        user={users[userKey]}
                        userKey={userKey}
                    />
                ))
            );

        const currentSelectedEnvironmnent = this.state.sandboxMode
            ? "SANDBOX"
            : "PRODUCTION";
        // if apikey is unchanged and environment is unchanged we don't allow user to set apikey
        const unchangedApiKeyEnvironment =
            this.state.apiKey === this.props.apiKey &&
            currentSelectedEnvironmnent === this.props.environment;

        const hasNoApiKey = this.props.apiKey === false;

        const buttonDisabled =
            unchangedApiKeyEnvironment ||
            // invalid inputs
            this.state.apiKeyValid === false ||
            this.state.deviceNameValid === false ||
            // user info is already being loaded
            this.props.userLoading === true ||
            // a bunq test user is being created
            this.props.loadingBunqUser === true ||
            // registration is loading
            this.props.registrationLoading === true;

        const setApiKeyClassname = `black-button ${buttonDisabled
            ? "disabled"
            : ""}`;

        const sandboxButtonDisabled =
            // user info is already being loaded
            this.props.userLoading === true ||
            // a bunq test user is being created
            this.state.loadingBunqUser === true ||
            // registration is loading
            this.props.registrationLoading === true;

        const apiKeyContent = hasNoApiKey ? (
            <React.Fragment>
                <CardContent style={styles.cardContent}>
                    <div style={{ textAlign: "center" }}>
                        {this.state.requestQrCodeBase64 === false ? (
                            <div style={styles.qrCode}>
                                <IconButton onClick={this.displayQrCode}>
                                    <QRSvg />
                                </IconButton>
                            </div>
                        ) : (
                            <img
                                className="animated fadeIn"
                                src={`data:image/png;base64, ${this.state
                                    .requestQrCodeBase64}`}
                                style={styles.qrCode}
                            />
                        )}
                        <TranslateTypography
                            variant="body2"
                            style={{ ...styles.text, margin: 0 }}
                        >
                            Scan the QR code with the bunq app to begin!
                        </TranslateTypography>
                    </div>

                    <Input
                        autoFocus
                        className={"text-input"}
                        style={styles.apiInput}
                        error={!this.state.deviceNameValid}
                        placeholder={t("Device Name")}
                        label={t("Device Name")}
                        onChange={this.handleNameChange}
                        value={this.state.deviceName}
                        disabled={
                            // unchanged api key
                            this.state.apiKey === this.props.apiKey
                        }
                        onKeyPress={ev => {
                            if (
                                ev.key === "Enter" &&
                                buttonDisabled === false
                            ) {
                                this.setRegistration();
                                ev.preventDefault();
                            }
                        }}
                    />

                    <Button
                        className="white-button"
                        onClick={this.toggleOptionVisibility}
                        style={styles.optionsButton}
                    >
                        {this.state.openOptions ? (
                            t("Less options")
                        ) : (
                            t("More options")
                        )}
                    </Button>

                    <Collapse in={this.state.openOptions}>
                        <Input
                            style={styles.apiInput}
                            className={"text-input"}
                            placeholder={t("API key")}
                            label={t("API key")}
                            hint={t("Your personal API key")}
                            onChange={this.handleKeyChange}
                            value={this.state.apiKey}
                            error={!this.state.apiKeyValid}
                            disabled={
                                // unchanged api key
                                this.state.apiKey === this.props.apiKey
                            }
                            onKeyPress={ev => {
                                if (
                                    ev.key === "Enter" &&
                                    buttonDisabled === false
                                ) {
                                    this.setRegistration();
                                    ev.preventDefault();
                                }
                            }}
                        />
                        <FormControlLabel
                            style={styles.environmentToggle}
                            label={
                                <TranslateTypography
                                    variant="body1"
                                    style={styles.text}
                                >
                                    Enable sandbox mode?
                                </TranslateTypography>
                            }
                            control={
                                <Switch
                                    checked={this.state.sandboxMode}
                                    onChange={this.handleCheckboxChange}
                                    aria-label="enable or disable sandbox mode"
                                />
                            }
                        />

                        {this.state.sandboxMode ? (
                            <TranslateButton
                                variant="raised"
                                color="secondary"
                                disabled={sandboxButtonDisabled}
                                style={styles.button}
                                onClick={this.createSandboxUser}
                            >
                                Create a sandbox account
                            </TranslateButton>
                        ) : null}

                        <TranslateButton
                            variant="raised"
                            color="primary"
                            className={setApiKeyClassname}
                            disabled={buttonDisabled}
                            style={styles.button}
                            onClick={this.setRegistration}
                        >
                            Set API Key
                        </TranslateButton>
                    </Collapse>
                </CardContent>

                {this.props.storedApiKeys.length > 0 ? (
                    <Button
                        to={"/switch-api-keys"}
                        component={NavLink}
                        style={styles.switchKeyButton}
                        className={"white-button"}
                        variant={"raised"}
                    >
                        Switch keys <KeyIcon style={styles.switchKeyIcon} />
                    </Button>
                ) : null}
            </React.Fragment>
        ) : (
            <CardContent style={styles.cardContent}>
                <TranslateTypography
                    variant="headline"
                    component="h2"
                    style={styles.text}
                >
                    You're logged in!
                </TranslateTypography>
                <TranslateButton
                    variant="raised"
                    color={"secondary"}
                    className={"black-button"}
                    style={styles.button}
                    onClick={this.props.logOut}
                    disabled={this.props.userLoading}
                >
                    Logout
                </TranslateButton>
            </CardContent>
        );

        const cardContent = this.props.registrationLoading ? (
            <CardContent style={styles.cardContent}>
                <TranslateTypography
                    variant="headline"
                    component="h2"
                    style={styles.text}
                >
                    Loading
                </TranslateTypography>
                <CircularProgress size={50} />
                <TranslateTypography variant="subheading">
                    {status_message}
                </TranslateTypography>
            </CardContent>
        ) : (
            apiKeyContent
        );

        return (
            <Grid
                container
                spacing={16}
                justify={"center"}
                alignItems={hasNoApiKey ? "center" : "baseline"}
                style={styles.wrapperContainer}
            >
                <Helmet>
                    <title>{`BunqDesktop - Login`}</title>
                </Helmet>

                <Grid
                    item
                    xs={12}
                    sm={10}
                    md={6}
                    lg={4}
                    className="login-wrapper"
                    style={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Card style={styles.card}>{cardContent}</Card>
                </Grid>
                {userItems}

                <img
                    src="./images/svg/login-bg2.svg"
                    id="login-background-image"
                />

                <span className="bunqdesktop-text-wrapper">
                    <span className="bunqdesktop-text-first">Bunq</span>
                    <span className="bunqdesktop-text-second">Desktop</span>
                </span>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        status_message: state.application.status_message,

        derivedPassword: state.registration.derivedPassword,
        registrationLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,
        storedApiKeys: state.registration.stored_api_keys,

        users: state.users.users,
        usersLoading: state.users.loading,

        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // clear api key from bunqjsclient and bunqdesktop
        logOut: () => dispatch(registrationLogOut(BunqJSClient, true)),
        // set the api key and stores the encrypted version
        setApiKey: (api_key, derivedPassword) =>
            dispatch(registrationSetApiKey(api_key, derivedPassword)),
        // attempt to load the api key with our password if one is stored
        loadApiKey: derivedPassword =>
            dispatch(registrationLoadApiKey(derivedPassword)),

        setEnvironment: environment =>
            dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name)),

        // login a given usertype
        loginUser: (type, updated = false) =>
            dispatch(userLogin(BunqJSClient, type, updated)),

        handleBunqError: error => BunqErrorHandler(dispatch, error)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Login)
);

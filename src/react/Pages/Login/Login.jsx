import React from "react";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import { FormControlLabel } from "material-ui/Form";
import Card, { CardContent } from "material-ui/Card";
import { CircularProgress } from "material-ui/Progress";
import { usersUpdate } from "../../Actions/users";
import {
    registrationClearApiKey,
    registrationLoadApiKey,
    registrationSetApiKey,
    registrationSetDeviceName,
    registrationSetEnvironment
} from "../../Actions/registration";
import UserItem from "./UserItem";
import { Redirect } from "react-router-dom";

const styles = {
    loginButton: {
        width: "100%",
        marginTop: 20
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    apiInput: {
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
            attemptingLogin: false
        };
    }

    componentDidMount() {
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
            sandboxMode: this.props.environment === "SANDBOX"
        });

        this.validateInputs(this.props.apiKey, this.props.deviceName);
    }

    setRegistration = () => {
        if (this.state.apiKey.length !== 64) {
            this.props.openSnackbar(
                "The API key you entered does not look valid"
            );
            return;
        }

        if (this.state.deviceName.length <= 0) {
            this.props.openSnackbar(
                "The device name has to be atleast 1 character."
            );
            return;
        } else if (this.state.deviceName.length > 32) {
            this.props.openSnackbar(
                "The device name can't be longer than 32 characters."
            );
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

    clearApiKey = () => {
        this.props.clearApiKey();
        this.setState({ apiKey: "", apiKeyValid: false });
    };

    handleKeyChange = event => {
        this.setState(
            {
                apiKey: event.target.value
            },
            _ => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleNameChange = event => {
        this.setState(
            {
                deviceName: event.target.value
            },
            _ => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleCheckboxChange = (event, checked) => {
        this.setState({ sandboxMode: checked });
    };

    validateInputs = (apiKey, deviceName) => {
        this.setState({
            apiKeyValid: apiKey !== false && apiKey.length === 64,
            deviceNameValid:
                deviceName !== false &&
                deviceName.length >= 1 &&
                deviceName.length <= 32
        });
    };

    render() {
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

        const { status_message, BunqJSClient, users } = this.props;
        const userItems = Object.keys(users).map(userKey => (
            <UserItem
                BunqJSClient={BunqJSClient}
                user={users[userKey]}
                userKey={userKey}
            />
        ));

        const currentSelectedEnvironmnent = this.state.sandboxMode
            ? "SANDBOX"
            : "PRODUCTION";
        // if apikey is unchanged and environment is unchanged we don't allow user to set apikey
        const unchangedApiKeyEnvironment =
            this.state.apiKey === this.props.apiKey &&
            currentSelectedEnvironmnent === this.props.environment;

        const buttonDisabled =
            unchangedApiKeyEnvironment ||
            // invalid inputs
            this.state.apiKeyValid === false ||
            this.state.deviceNameValid === false ||
            // user info is already being loaded
            this.props.userLoading === true ||
            // registration is loading
            this.props.registrationLoading === true;

        const apiKeyContent =
            this.props.apiKey === false ? (
                <CardContent>
                    <Typography variant="headline" component="h2">
                        Enter your API Key
                    </Typography>
                    <Typography variant="caption">
                        In the bunq app go to your Profile > Security > API Keys
                        and generate a new key
                    </Typography>
                    <Input
                        style={styles.apiInput}
                        error={!this.state.apiKeyValid}
                        placeholder="API Key"
                        label="API Key"
                        hint="Your personal API key"
                        onChange={this.handleKeyChange}
                        value={this.state.apiKey}
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
                    <Input
                        style={styles.apiInput}
                        error={!this.state.deviceNameValid}
                        placeholder="Device Name"
                        label="Device Name"
                        hint="Device name so you can recognize it later"
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
                    <FormControlLabel
                        style={styles.environmentToggle}
                        label="Enable sandbox mode?"
                        control={
                            <Switch
                                checked={this.state.sandboxMode}
                                onChange={this.handleCheckboxChange}
                                aria-label="enable or disable sandbox mode"
                            />
                        }
                    />

                    <Button
                        variant="raised"
                        disabled={buttonDisabled}
                        color={"primary"}
                        style={styles.loginButton}
                        onClick={this.setRegistration}
                    >
                        Set API Key
                    </Button>
                </CardContent>
            ) : (
                <CardContent>
                    <Typography variant="headline" component="h2">
                        You're logged in!
                    </Typography>
                    <Typography variant="caption">
                        Click one of the accounts in the list to get started or
                        logout to change the key or environment.
                    </Typography>
                    <Button
                        variant="raised"
                        color={"secondary"}
                        style={styles.clearButton}
                        onClick={this.clearApiKey}
                        disabled={this.props.userLoading}
                    >
                        Logout
                    </Button>
                </CardContent>
            );

        const cardContent = this.props.registrationLoading ? (
            <CardContent style={{ textAlign: "center" }}>
                <Typography variant="headline" component="h2">
                    Loading
                </Typography>
                <CircularProgress size={50} />
                <Typography variant="subheading">{status_message}</Typography>
            </CardContent>
        ) : (
            apiKeyContent
        );

        return (
            <Grid container spacing={16} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Login`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Card>{cardContent}</Card>
                </Grid>
                <Grid item xs={12} />

                {userItems}
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

        users: state.users.users,
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // clear api key from bunqjsclient and bunqdesktop
        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),
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

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

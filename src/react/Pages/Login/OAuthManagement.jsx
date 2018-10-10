import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import Logger from "../../Helpers/Logger";
import BunqErrorHandler from "../../Helpers/BunqErrorHandler";

import { oauthSetDetails } from "../../Actions/oauth";
import { openSnackbar } from "../../Actions/snackbar";

const styles = {
    button: {
        width: "100%",
        marginTop: 20
    },
    connectButton: {
        cursor: "pointer",
        width: "100%",
        marginTop: 20
    },
    optionsButton: {
        marginTop: 12,
        color: "#000000"
    },
    input: {
        width: "100%",
        marginTop: 20,
        color: "#000000"
    },
    card: {
        width: 250
    },
    formControl: {
        width: "100%",
        marginBottom: 8
    },
    inputLabel: {
        color: "#000000"
    },
    environmentToggle: {
        marginTop: 10,
        color: "#000000"
    },
    cardContent: {
        backgroundColor: "#ffffff",
        textAlign: "center"
    },
    text: {
        color: "#000000"
    },
    subHeading: {
        color: "#000000",
        marginBottom: 20
    }
};

class OAuthManagement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clientId: "",
            clientIdValid: true,
            clientSecret: "",
            clientSecretValid: true,

            sandboxClientId: "",
            sandboxClientIdValid: true,
            sandboxClientSecret: "",
            sandboxClientSecretValid: true,

            showHelp: false
        };

        this.isLoading = false;

        ipcRenderer.on("received-oauth-bunq-code", this.handleBunqCodeCallback);
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.setState(
                {
                    clientId: this.props.clientId,
                    clientSecret: this.props.clientSecret,
                    sandboxClientId: this.props.sandboxClientId,
                    sandboxClientSecret: this.props.sandboxClientSecret
                },
                () => {
                    this.validateInputs();
                    this.validateSandboxInputs();
                }
            );
        }
    }

    /**
     * Opens a secondary screen to begin OAuth login flow
     * @param event
     */
    openBunqConsentScreen = event => {
        const sandboxMode = this.props.sandboxMode;

        const targetUrl = this.props.BunqJSClient.formatOAuthAuthorizationRequestUrl(
            sandboxMode ? this.props.sandboxClientId : this.props.clientId,
            "http://localhost:1234",
            false,
            sandboxMode
        );
        ipcRenderer.send("open-bunq-oauth", { targetUrl: targetUrl });
    };

    /**
     * Receives the Code value from a separate window
     * @param event
     * @param data
     */
    handleBunqCodeCallback = (event, data) => {
        if (data) this.exchangeBunqOAuthToken(data);
    };

    /**
     * Attempts to exchange the code for a token
     * @param code
     */
    exchangeBunqOAuthToken = code => {
        const { sandboxMode, clientId, clientSecret, sandboxClientId, sandboxClientSecret } = this.props;

        const requestClientId = sandboxMode ? sandboxClientId : clientId;
        const requestClientSecret = sandboxMode ? sandboxClientSecret : clientSecret;

        const successMessage = this.props.t("Successfully authorized client!");
        const errorMessage = this.props.t("Something went wrong while trying to authorize the client");

        if (!code || this.isLoading) return;
        this.isLoading = true;

        // exchange the token
        Logger.debug(" = Begin exchanging OAuth token");
        Logger.debug(`clientSecret: ${requestClientId.substring(0, 8)}`);
        Logger.debug(`clientSecret: ${requestClientSecret.substring(0, 8)}`);
        Logger.debug(`code: ${code.substring(0, 8)}`);
        this.props.BunqJSClient.exchangeOAuthToken(
            requestClientId,
            requestClientSecret,
            "http://localhost:1234",
            code,
            false,
            sandboxMode
        )
            .then(accessToken => {
                this.isLoading = false;

                this.props.openSnackbar(successMessage);
                this.props.setApiKeyState(accessToken);
            })
            .catch(error => {
                this.isLoading = false;

                Logger.debug("Failed to authenticate OAuth");
                Logger.debug(`clientSecret: ${requestClientId ? requestClientId.substring(0, 8) : "no clientId"}`);
                Logger.debug(
                    `.clientSecret: ${requestClientSecret ? requestClientSecret.substring(0, 8) : "no secret"}`
                );
                Logger.debug(`code: ${code ? code.substring(0, 8) : "no code"}`);

                this.props.handleBunqError(error, errorMessage);
            });
    };

    /**
     * Stores the OAuth details for later use
     * @param event
     */
    setOauthDetails = event => {
        this.props.oauthSetDetails(
            this.state.clientId,
            this.state.clientSecret,
            this.state.sandboxClientId,
            this.state.sandboxClientSecret
        );
    };

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            () => {
                this.validateInputs();
                this.validateSandboxInputs();
            }
        );
    };

    validateInputs = () => {
        const clientSecretValid = this.state.clientSecret && this.state.clientSecret.length === 64;
        const clientIdValid = this.state.clientId && this.state.clientId.length === 64;

        this.setState(
            {
                clientSecretValid: clientSecretValid,
                clientIdValid: clientIdValid
            },
            () => {
                // waited for state to update and now save the details if valid
                if (clientSecretValid && clientIdValid) {
                    this.setOauthDetails();
                }
            }
        );
    };
    validateSandboxInputs = () => {
        const clientSecretValid = this.state.sandboxClientSecret && this.state.sandboxClientSecret.length === 64;
        const clientIdValid = this.state.sandboxClientId && this.state.sandboxClientId.length === 64;

        this.setState(
            {
                sandboxClientSecretValid: clientSecretValid,
                sandboxClientIdValid: clientIdValid
            },
            () => {
                // waited for state to update and now save the details if valid
                if (clientSecretValid && clientIdValid) {
                    this.setOauthDetails();
                }
            }
        );
    };

    render() {
        const { t, sandboxMode } = this.props;

        const clientId = sandboxMode ? this.state.sandboxClientId : this.state.clientId;
        const clientSecret = sandboxMode ? this.state.sandboxClientSecret : this.state.clientSecret;
        const clientIdValid = sandboxMode ? this.state.sandboxClientIdValid : this.state.clientSecretValid;
        const clientSecretValid = sandboxMode ? this.state.sandboxClientSecretValid : this.state.clientIdValid;

        const content = this.isLoading ? (
            <Grid item xs={12} style={styles.cardContent}>
                <TranslateTypography variant="headline" component="h2" style={styles.text}>
                    Waiting for authorization
                </TranslateTypography>
                <CircularProgress size={50} />
            </Grid>
        ) : (
            <Grid item xs={12}>
                <TranslateTypography variant="subheading" style={styles.subHeading}>
                    Login with limited permissions using OAuth
                </TranslateTypography>

                <FormControl style={styles.formControl}>
                    <InputLabel style={styles.inputLabel}>Client ID</InputLabel>
                    <Input
                        autoFocus
                        className={"text-input"}
                        style={styles.input}
                        error={!clientIdValid}
                        onChange={this.handleChange(sandboxMode ? "sandboxClientId" : "clientId")}
                        value={clientId}
                    />
                </FormControl>

                <FormControl style={styles.formControl}>
                    <InputLabel style={styles.inputLabel}>Client Secret</InputLabel>
                    <Input
                        className={"text-input"}
                        style={styles.input}
                        error={!clientSecretValid}
                        onChange={this.handleChange(sandboxMode ? "sandboxClientSecret" : "clientSecret")}
                        value={clientSecret}
                    />
                </FormControl>

                {this.state.clientSecretValid &&
                    this.state.clientIdValid && (
                        <img
                            style={styles.connectButton}
                            src="images/bunq_Connect_button_svg.svg"
                            onClick={this.openBunqConsentScreen}
                        />
                    )}

                <TranslateButton
                    style={styles.button}
                    rel="noopener"
                    variant="raised"
                    className="js-external-link white-button"
                    href="https://wiki.bunqdesk.top/setup/setup-oauth/"
                >
                    Need help?
                </TranslateButton>
            </Grid>
        );

        return (
            <React.Fragment>
                <Card style={styles.card}>
                    <CardContent style={styles.cardContent}>
                        <Grid container spacing={8} justify={"center"}>
                            {content}
                        </Grid>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        clientId: state.oauth.client_id,
        clientSecret: state.oauth.client_secret,

        sandboxClientId: state.oauth.sandbox_client_id,
        sandboxClientSecret: state.oauth.sandbox_client_secret,

        user: state.user.user,
        userType: state.user.user_type
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        oauthSetDetails: (clientId, clientSecret, sandboxClientId, sandboxClientSecret) =>
            dispatch(oauthSetDetails(clientId, clientSecret, sandboxClientId, sandboxClientSecret)),

        handleBunqError: (error, customError) => BunqErrorHandler(dispatch, error, customError)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(OAuthManagement));

import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Collapse from "@material-ui/core/Collapse";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import BunqErrorHandler from "../../Helpers/BunqErrorHandler";

import { oauthSetDetails } from "../../Actions/oauth";
import { openSnackbar } from "../../Actions/snackbar";

const styles = {
    button: {
        width: "100%",
        marginTop: 20
    },
    input: {
        width: "100%",
        marginTop: 20,
        color: "#000000"
    },
    inputLabel: {
        color: "#000000"
    },
    card: {
        width: 250
    },
    formControl: {
        width: "100%",
        marginBottom: 8
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
            clientSecretValud: true,

            showHelp: false,

            oauthCode: false
        };

        ipcRenderer.on("received-oauth-bunq-code", this.handleBunqCodeCallback);
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.setState(
                {
                    clientId: this.props.clientId,
                    clientSecret: this.props.clientSecret
                },
                this.validateInputs
            );
        }
    }

    /**
     * Opens a secondary screen to begin OAuth login flow
     * @param event
     */
    openBunqConsentScreen = event => {
        const targetUrl = this.props.BunqJSClient.formatOAuthAuthorizationRequestUrl(
            this.props.clientId,
            "http://localhost:1234"
        );
        ipcRenderer.send("open-bunq-oauth", { targetUrl: targetUrl });
    };

    /**
     * Receives the Code value from a separate window
     * @param event
     * @param data
     */
    handleBunqCodeCallback = (event, data) => {
        this.setState({
            oauthCode: data
        });
        this.exchangeBunqOAuthToken(data);
    };

    /**
     * Attempts to exchange the code for a token
     * @param code
     */
    exchangeBunqOAuthToken = code => {
        const successMessage = this.props.t("Successfully authorized client!");
        const errorMessage = this.props.t(
            "Something went wrong while trying to authorize the client"
        );

        if(!code || this.state.loading) return;

        this.setState({
            loading: true
        });

        // exchange the token
        this.props.BunqJSClient.exchangeOAuthToken(
            this.props.clientId,
            this.props.clientSecret,
            "http://localhost:1234",
            code
        )
            .then(accessToken => {
                this.setState({
                    loading: false
                });

                this.props.openSnackbar(successMessage);
                this.props.setApiKeyState(accessToken);
            })
            .catch(error => {
                this.setState({
                    loading: false
                });

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
            this.state.clientSecret
        );
    };

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            this.validateInputs
        );
    };

    validateInputs = () => {
        const clientSecretValid =
            this.state.clientSecret && this.state.clientSecret.length === 64;
        const clientIdValid =
            this.state.clientId && this.state.clientId.length === 64;

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

    render() {
        const { t } = this.props;

        const content = this.state.loading ? (
            <Grid item xs={12} style={styles.cardContent}>
                <TranslateTypography
                    variant="headline"
                    component="h2"
                    style={styles.text}
                >
                    Waiting for authorization
                </TranslateTypography>
                <CircularProgress size={50} />
            </Grid>
        ) : (
            <Grid item xs={12}>
                <TranslateTypography
                    variant="subheading"
                    style={styles.subHeading}
                >
                    Login with limited permissions using OAuth
                </TranslateTypography>

                <FormControl style={styles.formControl}>
                    <InputLabel style={styles.inputLabel}>Client ID</InputLabel>
                    <Input
                        autoFocus
                        className={"text-input"}
                        style={styles.input}
                        error={!this.state.clientIdValid}
                        placeholder={t("Client ID")}
                        onChange={this.handleChange("clientId")}
                        value={this.state.clientId}
                    />
                </FormControl>

                <FormControl style={styles.formControl}>
                    <InputLabel style={styles.inputLabel}>
                        Client Secret
                    </InputLabel>
                    <Input
                        className={"text-input"}
                        style={styles.input}
                        error={!this.state.clientSecretValid}
                        placeholder={t("Client Secret")}
                        onChange={this.handleChange("clientSecret")}
                        value={this.state.clientSecret}
                    />
                </FormControl>

                <TranslateButton
                    variant="raised"
                    className="black-button"
                    style={styles.button}
                    disabled={
                        !this.state.clientSecretValid ||
                        !this.state.clientIdValid
                    }
                    onClick={this.openBunqConsentScreen}
                >
                    Authenticate
                </TranslateButton>

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
            <CardContent style={styles.cardContent}>
                <Grid container spacing={8} justify={"center"}>
                    {content}
                </Grid>
            </CardContent>
        );
    }
}

const mapStateToProps = state => {
    return {
        clientId: state.oauth.client_id,
        clientSecret: state.oauth.client_secret,

        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        oauthSetDetails: (clientId, clientSecret) =>
            dispatch(oauthSetDetails(clientId, clientSecret, BunqJSClient)),

        handleBunqError: (error, customError) =>
            BunqErrorHandler(dispatch, error, customError)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(OAuthManagement));

import React from "react";
import { translate } from "react-i18next";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import List from "@material-ui/core/List";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RemoveIcon from "@material-ui/icons/Delete";

import TranslateTypography from "../Components/TranslationHelpers/Typography";

import {
    registrationRemoveStoredApiKey,
    registrationLoadStoredApiKey,
    registrationLogOut
} from "../Actions/registration";

const styles = {
    wrapperContainer: {
        height: "100%"
    },
    paper: {
        padding: 8
    },
    text: {
        textAlign: "center",
        marginBottom: 16
    },
    textBody: {
        textAlign: "center"
    }
};

class SwitchApiKeys extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.apiKey) {
            this.props.history.push("/");
        }
    }

    selectApiKey = index => event => {
        this.props.loadStoredApiKeys(index, this.props.derivedPassword);
        this.props.history.push("/login");
    };

    removeStoredApiKey = index => event => {
        // remove this key from history
        this.props.removeStoredApiKey(index);
    };

    render() {
        const { storedApiKeys, passwordIdentifier, t } = this.props;

        if (this.props.derivedPassword === false && this.props.registrationLoading === false) {
            // no password set, go to password screen
            return <Redirect to="/password" />;
        }

        const apiKeyItems = storedApiKeys.map((storedApiKey, index) => {
            return (
                <ListItem
                    button
                    onClick={this.selectApiKey(index)}
                    disabled={storedApiKey.identifier !== passwordIdentifier}
                >
                    <ListItemText
                        primary={storedApiKey.device_name}
                        secondary={storedApiKey.environment === "SANDBOX" ? t("Sandbox key") : t("Production key")}
                    />
                    <ListItemSecondaryAction>
                        {storedApiKey.isOAuth ? <Chip label="OAuth" /> : null}
                        <IconButton onClick={this.removeStoredApiKey(index)}>
                            <RemoveIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });

        return (
            <Grid container spacing={16} style={styles.wrapperContainer}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Switch API keys")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2} md={3}>
                    <Button onClick={this.props.history.goBack} style={styles.btn}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} md={6}>
                    <Paper style={styles.paper}>
                        {apiKeyItems.length > 0 ? (
                            <List>{apiKeyItems}</List>
                        ) : (
                            <TranslateTypography variant="h6" style={styles.text}>
                                No stored API keys set!
                            </TranslateTypography>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={2} md={3}>
                    <Paper style={styles.paper}>
                        <TranslateTypography variant="body2" style={styles.textBody}>
                            When you login with an API key it will appear in this list
                        </TranslateTypography>
                        <TranslateTypography variant="body2" style={styles.textBody}>
                            A disabled button means the API key was stored with a different password so it can't be
                            decrypted
                        </TranslateTypography>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        status_message: state.application.status_message,

        derivedPassword: state.registration.derivedPassword,
        passwordIdentifier: state.registration.identifier,
        registrationLoading: state.registration.loading,
        storedApiKeys: state.registration.stored_api_keys,
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
        // attempt to load the api key with our password if one is stored
        loadStoredApiKeys: (index, derivedPassword) =>
            dispatch(registrationLoadStoredApiKey(BunqJSClient, index, derivedPassword)),

        logOut: () => dispatch(registrationLogOut(BunqJSClient)),

        removeStoredApiKey: index => dispatch(registrationRemoveStoredApiKey(index))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(SwitchApiKeys));

import React from "react";
import { translate } from "react-i18next";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import List, {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";

import ArrowBackIcon from "material-ui-icons/ArrowBack";
import RemoveIcon from "material-ui-icons/Delete";

import {
    registrationRemoveStoredApiKey,
    registrationLoadStoredApiKey,
    registrationResetToApiScreen
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

    componentWillMount() {
        if (this.props.apiKey) {
            // reset to api screen
            console.log("logout and sent to login screen");
            this.props.history.push("/login");
            this.props.resetToApiScreen();
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
        const { storedApiKeys, t } = this.props;

        if (
            this.props.derivedPassword === false &&
            this.props.registrationLoading === false
        ) {
            // no password set, go to password screen
            return <Redirect to="/password" />;
        }

        const apiKeyItems = storedApiKeys.map((storedApiKey, index) => {
            return (
                <ListItem button onClick={this.selectApiKey(index)}>
                    <ListItemText
                        primary={storedApiKey.device_name}
                        secondary={
                            storedApiKey.environment === "SANDBOX" ? (
                                t("Sandbox key")
                            ) : (
                                t("Production key")
                            )
                        }
                    />
                    <ListItemSecondaryAction>
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
                    <title>{`BunqDesktop - ${t("Switch API keys")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2} md={3}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} md={6}>
                    <Paper style={styles.paper}>
                        {apiKeyItems.length > 0 ? (
                            <List>{apiKeyItems}</List>
                        ) : (
                            <Typography variant={"title"} style={styles.text}>
                                No stored API keys set!
                            </Typography>
                        )}

                        <Typography variant={"body1"} style={styles.textBody}>
                            To add more API keys, logout and log in with the
                            same password and a different API key
                        </Typography>
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
            dispatch(
                registrationLoadStoredApiKey(
                    BunqJSClient,
                    index,
                    derivedPassword
                )
            ),
        // resets all data to go back ot api screen
        resetToApiScreen: () =>
            dispatch(registrationResetToApiScreen(BunqJSClient)),

        removeStoredApiKey: index =>
            dispatch(registrationRemoveStoredApiKey(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(SwitchApiKeys)
);

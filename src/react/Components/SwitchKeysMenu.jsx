import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from "@material-ui/core/TextField";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import KeyIcon from "@material-ui/icons/VpnKey";
import RemoveIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

import TranslateTypography from "./TranslationHelpers/Typography";

import {
    registrationRemoveStoredApiKey,
    registrationSetStoredApiKeys,
    registrationSwitchKeys
} from "../Actions/registration";

const styles = {
    list: {
        width: 250,
        paddingBottom: 50,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        WebkitAppRegion: "no-drag",
        flexGrow: 1
    },
    textField: {
        width: "100%",
        paddingBottom: 8
    },
    listFiller: {
        flex: "1 1 100%"
    },
    listItemText: {
        paddingRight: 55
    },
    textWrapper: {
        padding: 16
    },
    secondaryAction: {
        display: "flex",
        alignItems: "center"
    },
    icon: {
        margin: 8
    }
};

class SwitchKeysMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false,

            editMode: false,

            storedKeyValues: {},
            storedKeyValueChanged: false
        };
    }

    toggleOpen = event => {
        this.setState({
            anchorEl: !this.state.open ? event.currentTarget : null,
            open: !this.state.open
        });
    };

    registrationLogin = () => {
        this.props.registrationLogin(
            this.props.derivedPassword,
            this.props.apiKey,
            this.props.deviceName,
            this.props.environment,
            this.props.permittedIps
        );
    };

    selectApiKey = index => event => {
        this.props.registrationSwitchKeys(index);
        this.props.history.push("/login");
    };

    removeStoredApiKey = index => event => {
        // remove this key from history
        this.props.removeStoredApiKey(index);
    };

    onChange = index => e => {
        const storedApiKeys = this.props.storedApiKeys;
        const storedKeyValues = { ...this.state.storedKeyValues };
        if (storedApiKeys[index]) {
            storedKeyValues[index] = e.target.value;
            storedApiKeys[index].device_name = e.target.value;

            this.setState({
                storedKeyValues: storedKeyValues
            });
            this.props.registrationSetStoredApiKeys(storedApiKeys);
        }
    };

    toggleEditMode = e => {
        this.setState({ editMode: !this.state.editMode, storedKeyValues: {} });
    };

    render() {
        const { storedKeyValues } = this.state;
        const { t, storedApiKeys, derivedPasswordIdentifier } = this.props;
        const noKeysText = t("No stored keys found");

        const apiKeyItems = storedApiKeys.map((storedApiKey, index) => {
            const environmentText = storedApiKey.environment === "SANDBOX" ? t("Sandbox key") : t("Production key");
            const OAuthText = storedApiKey.isOAuth ? t("OAuth") : "";
            const secondaryText = `${OAuthText} ${environmentText}`;

            return this.state.editMode ? (
                <ListItem dense>
                    <TextField
                        style={styles.textField}
                        value={storedKeyValues[index] || storedApiKey.device_name}
                        onChange={this.onChange(index)}
                    />
                </ListItem>
            ) : (
                <ListItem
                    dense
                    button
                    onClick={this.selectApiKey(index)}
                    disabled={storedApiKey.identifier !== derivedPasswordIdentifier}
                >
                    <ListItemText
                        style={styles.listItemText}
                        primary={storedApiKey.device_name}
                        secondary={secondaryText}
                    />
                    <ListItemSecondaryAction style={styles.secondaryAction}>
                        {storedApiKey.isOAuth ? <VerifiedUserIcon color="action" style={styles.icon} /> : null}
                        <IconButton onClick={this.removeStoredApiKey(index)}>
                            <RemoveIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });

        return (
            <React.Fragment>
                <IconButton onClick={this.toggleOpen}>
                    <KeyIcon />
                </IconButton>
                <Drawer
                    variant="temporary"
                    anchor="right"
                    className="options-drawer"
                    open={this.state.open}
                    onClose={this.toggleOpen}
                    SlideProps={{
                        style: { top: 50 }
                    }}
                >
                    <List style={styles.list}>
                        <div style={styles.textWrapper}>
                            <TranslateTypography variant="subtitle1">Stored API keys</TranslateTypography>
                            <TranslateTypography variant="body2">
                                When you login with an API key it will appear in this list
                            </TranslateTypography>
                            <TranslateTypography variant="body2">
                                A disabled button means the API key was stored with a different password so it can't be
                                decrypted
                            </TranslateTypography>
                        </div>
                        {storedApiKeys.length > 0 ? (
                            apiKeyItems
                        ) : (
                            <ListItem>
                                <ListItemText primary={noKeysText} />
                            </ListItem>
                        )}

                        <ListItem style={styles.listFiller} />

                        <ListItem button onClick={this.toggleEditMode}>
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary={this.state.editMode ? t("Finish editing") : t("Edit key names")} />
                        </ListItem>
                    </List>
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        derivedPassword: state.registration.derived_password,
        derivedPasswordIdentifier: state.registration.identifier,
        registrationLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,
        storedApiKeys: state.registration.stored_api_keys
    };
};

const mapDispatchToProps = dispatch => {
    return {
        registrationSwitchKeys: storedKeyIndex => dispatch(registrationSwitchKeys(storedKeyIndex)),

        registrationSetStoredApiKeys: storedApiKeys => dispatch(registrationSetStoredApiKeys(storedApiKeys)),
        removeStoredApiKey: index => dispatch(registrationRemoveStoredApiKey(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(SwitchKeysMenu));

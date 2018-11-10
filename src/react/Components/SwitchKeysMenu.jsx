import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import KeyIcon from "@material-ui/icons/VpnKey";
import RemoveIcon from "@material-ui/icons/Delete";

import { registrationRemoveStoredApiKey, registrationSwitchKeys } from "../Actions/registration";

const styles = {
    list: {
        width: 240
    }
};

class SwitchKeysMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false
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
        this.props.registrationSwitchKeys(index, this.props.derivedPassword, this.props.derivedPasswordIdentifier);
        this.props.history.push("/login");
    };

    removeStoredApiKey = index => event => {
        // remove this key from history
        this.props.removeStoredApiKey(index);
    };

    render() {
        const { t, storedApiKeys, derivedPasswordIdentifier } = this.props;

        const apiKeyItems = storedApiKeys.map((storedApiKey, index) => {
            return (
                <ListItem
                    dense
                    button
                    onClick={this.selectApiKey(index)}
                    disabled={storedApiKey.identifier !== derivedPasswordIdentifier}
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
                    <List style={styles.list}>{apiKeyItems}</List>
                </Drawer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        derivedPassword: state.registration.derivedPassword,
        derivedPasswordIdentifier: state.registration.identifier,
        registrationLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,
        storedApiKeys: state.registration.stored_api_keys
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        registrationSwitchKeys: (storedKeyIndex, derivedPassword, derivedPasswordIdentifier) =>
            dispatch(registrationSwitchKeys(BunqJSClient, storedKeyIndex, derivedPassword, derivedPasswordIdentifier)),

        removeStoredApiKey: index => dispatch(registrationRemoveStoredApiKey(index))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(SwitchKeysMenu));

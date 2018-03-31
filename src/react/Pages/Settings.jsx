import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Select from "material-ui/Select";
import Paper from "material-ui/Paper";
import Switch from "material-ui/Switch";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";

import ArrowBackIcon from "material-ui-icons/ArrowBack";

const remote = require("electron").remote;
const path = remote.require("path");
const packageInfo = require("../../../package.json");
const SUPPORTED_LANGUAGES = packageInfo.supported_languages;

import NavLink from "../Components/Routing/NavLink";
import FilePicker from "../Components/FormFields/FilePicker";
import ButtonTranslate from "../Components/TranslationHelpers/Button";
import TypographyTranslate from "../Components/TranslationHelpers/Typography";
import MenuItemTranslate from "../Components/TranslationHelpers/MenuItem";

import { openSnackbar } from "../Actions/snackbar";
import {
    resetApplication,
    setHideBalance,
    setInactivityCheckDuration,
    setMinimizeToTray,
    setNativeFrame,
    setStickyMenu,
    setTheme,
    setLanguage,
    overwriteSettingsLocation,
    toggleInactivityCheck,
    loadSettingsLocation
} from "../Actions/options";
import { registrationClearApiKey } from "../Actions/registration";

const styles = {
    avatar: {
        width: 55,
        height: 55
    },
    formControl: {
        width: "100%"
    },
    selectField: {
        width: "100%"
    },
    button: {
        width: "100%",
        textAlign: "center"
    },
    paper: {
        padding: 24
    }
};

const getPrettyLanguage = key => {
    switch (key) {
        case "en":
            return "English";
        case "nl":
            return "Nederlands";
        case "de":
            return "Deutsch";
        case "es":
            return "Español";
        case "it":
            return "Italiano";
    }
    return key;
};

const humanReadableThemes = {
    DefaultTheme: "Light theme",
    DarkTheme: "Dark theme"
};

class Settings extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clearConfirmation: false,
            openImportDialog: false,
            importTargetLocation: ""
        };
    }

    handleThemeChange = event => {
        this.props.setTheme(event.target.value);
    };

    handleLanguageChange = event => {
        this.props.setLanguage(event.target.value);
    };

    handleNativeFrameCheckChange = event => {
        this.props.openSnackbar(
            "Restart the application to view these changes!"
        );
        this.props.setNativeFrame(!this.props.nativeFrame);
    };

    handleStickyMenuCheckChange = event => {
        this.props.setStickyMenu(!this.props.stickyMenu);
    };
    handleMinimizeToTrayChange = event => {
        this.props.setMinimizeToTray(!this.props.minimizeToTray);
    };
    handleHideBalanceCheckChange = event => {
        this.props.setHideBalance(!this.props.hideBalance);
    };
    handleHideInactivityCheckChange = event => {
        this.props.toggleInactivityCheck(!this.props.checkInactivity);
    };
    handleHideInactivityDurationChange = event => {
        this.props.setInactivityCheckDuration(event.target.value);
    };
    handleResetBunqDesktop = event => {
        if (this.state.clearConfirmation === false) {
            this.setState({ clearConfirmation: true });
        } else {
            this.props.resetApplication();
        }
    };

    displayImportDialog = newPath => {
        this.setState({
            importTargetLocation: `${newPath}${path.sep}BunqDesktopSettings.json`,
            openImportDialog: true
        });
    };
    overwriteSettingsFile = () => {
        this.props.overwriteSettingsLocation(this.state.importTargetLocation);
        this.setState({
            openImportDialog: false
        });
    };
    importSettingsFile = () => {
        this.props.loadSettingsLocation(this.state.importTargetLocation);
        this.setState({
            openImportDialog: false
        });
    };

    render() {
        const t = this.props.t;

        const clearBunqDesktopText1 = t("Are you absolutely sure");
        const clearBunqDesktopTex2 = t("Reset BunqDesktop");
        const clearBunqDesktopText = this.state.clearConfirmation
            ? clearBunqDesktopText1
            : clearBunqDesktopTex2;

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Settings")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={6} sm={8} md={9} lg={10}>
                                <TypographyTranslate variant={"headline"}>
                                    Settings
                                </TypographyTranslate>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <ButtonTranslate
                                    variant="raised"
                                    color="secondary"
                                    style={styles.button}
                                    onClick={this.props.clearApiKey}
                                >
                                    Logout
                                </ButtonTranslate>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="theme-selection">
                                        {t("Theme")}
                                    </InputLabel>
                                    <Select
                                        value={this.props.theme}
                                        onChange={this.handleThemeChange}
                                        input={<Input id="theme-selection" />}
                                        style={styles.selectField}
                                    >
                                        {Object.keys(
                                            this.props.themeList
                                        ).map(themeKey => (
                                            <MenuItem value={themeKey}>
                                                {humanReadableThemes[themeKey]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="theme-selection">
                                        Language
                                    </InputLabel>
                                    <Select
                                        value={this.props.language}
                                        onChange={this.handleLanguageChange}
                                        input={
                                            <Input id="language-selection" />
                                        }
                                        style={styles.selectField}
                                    >
                                        {SUPPORTED_LANGUAGES.map(language => (
                                            <MenuItem value={language}>
                                                {getPrettyLanguage(language)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="nativeframe-selection"
                                            checked={this.props.nativeFrame}
                                            onChange={
                                                this
                                                    .handleNativeFrameCheckChange
                                            }
                                        />
                                    }
                                    label={t("Use the native frame")}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="minimize-to-try-selection"
                                            checked={this.props.minimizeToTray}
                                            onChange={
                                                this.handleMinimizeToTrayChange
                                            }
                                        />
                                    }
                                    label={t("Minimize to tray")}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="sticky-menu-selection"
                                            checked={this.props.stickyMenu}
                                            onChange={
                                                this.handleStickyMenuCheckChange
                                            }
                                        />
                                    }
                                    label={t("Enable sticky menu")}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="hide-balance-selection"
                                            checked={this.props.hideBalance}
                                            onChange={
                                                this
                                                    .handleHideBalanceCheckChange
                                            }
                                        />
                                    }
                                    label={t("Hide account balances")}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id="inactivity-check-selection"
                                            checked={this.props.checkInactivity}
                                            onChange={
                                                this
                                                    .handleHideInactivityCheckChange
                                            }
                                        />
                                    }
                                    label={t("Logout automatically")}
                                />
                                {this.props.checkInactivity ? (
                                    <Select
                                        value={
                                            this.props.inactivityCheckDuration
                                        }
                                        onChange={
                                            this
                                                .handleHideInactivityDurationChange
                                        }
                                    >
                                        <MenuItemTranslate key={60} value={60}>
                                            1 Minute
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={120}
                                            value={120}
                                        >
                                            2 Minutes
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={300}
                                            value={300}
                                        >
                                            5 Minutes
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={600}
                                            value={600}
                                        >
                                            10 Minutes
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={1800}
                                            value={1800}
                                        >
                                            30 Minutes
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={3600}
                                            value={3600}
                                        >
                                            1 Hour
                                        </MenuItemTranslate>
                                        <MenuItemTranslate
                                            key={7200}
                                            value={7200}
                                        >
                                            2 Hours
                                        </MenuItemTranslate>
                                    </Select>
                                ) : null}
                            </Grid>

                            <Grid item xs={12}>
                                <FilePicker
                                    buttonContent={"Change settings location"}
                                    extensions={["json"]}
                                    properties={[
                                        "openDirectory",
                                        "promptToCreate"
                                    ]}
                                    value={this.props.settingsLocation}
                                    defaultPath={path.dirname(
                                        this.props.settingsLocation
                                    )}
                                    onChange={this.displayImportDialog}
                                />
                            </Grid>

                            <Grid item xs={12} />

                            <Grid item xs={12} sm={4}>
                                <ButtonTranslate
                                    variant="raised"
                                    component={NavLink}
                                    to={"/debug-page"}
                                    style={styles.button}
                                >
                                    Debug application
                                </ButtonTranslate>
                            </Grid>

                            <Grid item xs={12} sm={4} />

                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="raised"
                                    color="secondary"
                                    style={styles.button}
                                    onClick={this.handleResetBunqDesktop}
                                >
                                    {clearBunqDesktopText}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Dialog open={this.state.openImportDialog}>
                        <DialogTitle>Change settings location</DialogTitle>

                        <DialogContent>
                            <DialogContentText>
                                You are about to change the settings location
                                to:
                            </DialogContentText>
                            <DialogContentText>
                                {this.state.importTargetLocation}
                            </DialogContentText>
                            <DialogContentText>
                                Would you like to import the settings file or
                                overwrite the settings currently in BunqDesktop?
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions>
                            <ButtonTranslate
                                variant="raised"
                                onClick={() =>
                                    this.setState({ openImportDialog: false })}
                            >
                                Cancel
                            </ButtonTranslate>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.overwriteSettingsFile}
                                color="secondary"
                            >
                                Overwrite file
                            </ButtonTranslate>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.importSettingsFile}
                                color="primary"
                            >
                                Import file
                            </ButtonTranslate>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme,
        language: state.options.language,
        hideBalance: state.options.hide_balance,
        minimizeToTray: state.options.minimize_to_tray,
        nativeFrame: state.options.native_frame,
        stickyMenu: state.options.sticky_menu,
        checkInactivity: state.options.check_inactivity,
        settingsLocation: state.options.settings_location,
        inactivityCheckDuration: state.options.inactivity_check_duration
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        // options and options_drawer handlers
        openSnackbar: message => dispatch(openSnackbar(message)),
        setTheme: theme => dispatch(setTheme(theme)),
        setLanguage: language => dispatch(setLanguage(language)),
        setNativeFrame: useFrame => dispatch(setNativeFrame(useFrame)),
        setStickyMenu: userStickyMenu =>
            dispatch(setStickyMenu(userStickyMenu)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        setMinimizeToTray: minimizeToTray =>
            dispatch(setMinimizeToTray(minimizeToTray)),
        toggleInactivityCheck: inactivityCheck =>
            dispatch(toggleInactivityCheck(inactivityCheck)),
        setInactivityCheckDuration: inactivityCheckDuration =>
            dispatch(setInactivityCheckDuration(inactivityCheckDuration)),
        overwriteSettingsLocation: location =>
            dispatch(overwriteSettingsLocation(location)),
        loadSettingsLocation: location =>
            dispatch(loadSettingsLocation(location)),

        // clear api key from bunqjsclient and bunqdesktop
        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),
        // full hard reset off all storage
        resetApplication: () => dispatch(resetApplication())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Settings)
);

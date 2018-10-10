import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import RemoveIcon from "@material-ui/icons/Delete";
import HomeIcon from "@material-ui/icons/Home";

import path from "../ImportWrappers/path";
import { getPrettyLanguage } from "../Helpers/Utils";
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
    setSyncOnStartup,
    setHideBalance,
    setMinimizeToTray,
    setNativeFrame,
    setStickyMenu,
    setTheme,
    setLanguage,
    overwriteSettingsLocation,
    toggleInactivityCheck,
    setInactivityCheckDuration,
    toggleAutomaticUpdatesEnabled,
    setAutomaticUpdateDuration,
    loadSettingsLocation,
    setAutomaticThemeChange,
    setAnalyticsEnabled,
    toggleAutomaticUpdatesSendNotification
} from "../Actions/options";
import { registrationClearPrivateData, registrationLogOut } from "../Actions/registration";

const styles = {
    sideButton: {
        marginBottom: 16
    },
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

    clearPrivateData = event => {
        this.props.clearPrivateData();

        // minor delay to ensure it happens after the state updates
        setTimeout(() => {
            this.props.history.push("/");
        }, 500);
    };

    logout = event => {
        this.props.logOut();

        // minor delay to ensure it happens after the state updates
        setTimeout(() => {
            this.props.history.push("/");
        }, 500);
    };

    handleNativeFrameCheckChange = event => {
        this.props.openSnackbar(this.props.t("Restart the application to view these changes!"));
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
    handleAnalyticsEnabledChange = event => {
        // if next state is false, display a mesage
        if (!this.props.analyticsEnabled === false) {
            this.props.openSnackbar(this.props.t("Restart the application to start without Google Analytics!"));
        }
        this.props.setAnalyticsEnabled(!this.props.analyticsEnabled);
    };
    handleAutomaticThemeChange = event => {
        this.props.setAutomaticThemeChange(!this.props.automaticThemeChange);
    };
    handleHideInactivityCheckChange = event => {
        this.props.toggleInactivityCheck(!this.props.checkInactivity);
    };
    handleHideInactivityDurationChange = event => {
        this.props.setInactivityCheckDuration(event.target.value);
    };
    handleAutomaticUpdatesEnabledChane = event => {
        this.props.toggleAutomaticUpdatesEnabled(!this.props.automaticUpdateEnabled);
    };
    handleAutomaticUpdateDurationChane = event => {
        this.props.setAutomaticUpdateDuration(event.target.value);
    };
    handleSyncOnStartupChange = event => {
        this.props.setSyncOnStartup(!this.props.syncOnStartup);
    };
    handleAutomaticUpdatesSendNotificationChange = event => {
        this.props.toggleAutomaticUpdatesSendNotification(!this.props.automaticUpdateSendNotification);
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
        const clearBunqDesktopTex2 = t("Reset bunqDesktop");
        const clearBunqDesktopText = this.state.clearConfirmation ? clearBunqDesktopText1 : clearBunqDesktopTex2;

        const settingsContainer = (
            <Grid container spacing={16}>
                <Grid item xs={12} md={6} lg={8}>
                    <TypographyTranslate variant="h5">Settings</TypographyTranslate>
                </Grid>

                <Grid item xs={6} md={3} lg={2}>
                    <Button variant="contained" color="secondary" style={styles.button} onClick={this.clearPrivateData}>
                        {t("Remove keys")} <RemoveIcon />
                    </Button>
                </Grid>

                <Grid item xs={6} md={3} lg={2}>
                    <Button variant="contained" color="primary" style={styles.button} onClick={this.logout}>
                        {t("Logout")} <LogoutIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl style={styles.formControl}>
                        <InputLabel htmlFor="theme-selection">{t("Theme")}</InputLabel>
                        <Select
                            value={this.props.theme}
                            onChange={this.handleThemeChange}
                            input={<Input id="theme-selection" />}
                            style={styles.selectField}
                        >
                            {Object.keys(this.props.themeList).map(themeKey => (
                                <MenuItem value={themeKey}>{humanReadableThemes[themeKey]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl style={styles.formControl}>
                        <InputLabel htmlFor="theme-selection">Language</InputLabel>
                        <Select
                            value={this.props.language}
                            onChange={this.handleLanguageChange}
                            input={<Input id="language-selection" />}
                            style={styles.selectField}
                        >
                            {SUPPORTED_LANGUAGES.map(language => (
                                <MenuItem value={language}>{getPrettyLanguage(language)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* automatic updates */}
                <Grid item xs={12} md={this.props.automaticUpdateEnabled ? 6 : 12}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="inactivity-check-selection"
                                checked={this.props.automaticUpdateEnabled}
                                onChange={this.handleAutomaticUpdatesEnabledChane}
                            />
                        }
                        label={t("Update automatically in the background")}
                    />
                </Grid>
                {this.props.automaticUpdateEnabled ? (
                    <Grid item xs={12} md={6}>
                        <Select
                            style={styles.selectField}
                            value={this.props.automaticUpdateDuration}
                            onChange={this.handleAutomaticUpdateDurationChane}
                        >
                            <MenuItemTranslate key={60} value={60}>
                                1 Minute
                            </MenuItemTranslate>
                            <MenuItemTranslate key={120} value={120}>
                                2 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={300} value={300}>
                                5 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={600} value={600}>
                                10 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={1800} value={1800}>
                                30 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={3600} value={3600}>
                                1 Hour
                            </MenuItemTranslate>
                            <MenuItemTranslate key={7200} value={7200}>
                                2 Hours
                            </MenuItemTranslate>
                        </Select>
                    </Grid>
                ) : null}

                {/* send events if new events are found in an automatic sync */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="notification-on-new-events"
                                checked={this.props.automaticUpdateSendNotification}
                                onChange={this.handleAutomaticUpdatesSendNotificationChange}
                            />
                        }
                        label={t("Send a notification on new events")}
                    />
                </Grid>

                {/* sync on startup */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="sync-on-startup"
                                checked={this.props.syncOnStartup}
                                onChange={this.handleSyncOnStartupChange}
                            />
                        }
                        label={t("Run background sync on startup")}
                    />
                </Grid>

                {/* hide account balances */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="hide-balance-selection"
                                checked={this.props.hideBalance}
                                onChange={this.handleHideBalanceCheckChange}
                            />
                        }
                        label={t("Hide account balances")}
                    />
                </Grid>

                {/* use native frame */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="nativeframe-selection"
                                checked={this.props.nativeFrame}
                                onChange={this.handleNativeFrameCheckChange}
                            />
                        }
                        label={t("Use the native frame")}
                    />
                </Grid>

                {/* use sticky menu */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="sticky-menu-selection"
                                checked={this.props.stickyMenu}
                                onChange={this.handleStickyMenuCheckChange}
                            />
                        }
                        label={t("Enable sticky menu")}
                    />
                </Grid>

                {/* change theme based on time */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="automatic-change-selection"
                                checked={this.props.automaticThemeChange}
                                onChange={this.handleAutomaticThemeChange}
                            />
                        }
                        label={t("Automatically switch theme based on the time")}
                    />
                </Grid>

                {/* check inactivity */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="inactivity-check-selection"
                                checked={this.props.checkInactivity}
                                onChange={this.handleHideInactivityCheckChange}
                            />
                        }
                        label={t("Logout automatically")}
                    />
                    {this.props.checkInactivity ? (
                        <Select
                            style={styles.selectField}
                            value={this.props.inactivityCheckDuration}
                            onChange={this.handleHideInactivityDurationChange}
                        >
                            <MenuItemTranslate key={60} value={60}>
                                1 Minute
                            </MenuItemTranslate>
                            <MenuItemTranslate key={120} value={120}>
                                2 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={300} value={300}>
                                5 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={600} value={600}>
                                10 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={1800} value={1800}>
                                30 Minutes
                            </MenuItemTranslate>
                            <MenuItemTranslate key={3600} value={3600}>
                                1 Hour
                            </MenuItemTranslate>
                            <MenuItemTranslate key={7200} value={7200}>
                                2 Hours
                            </MenuItemTranslate>
                        </Select>
                    ) : null}
                </Grid>

                {/* minimize to tray */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="minimize-to-try-selection"
                                checked={this.props.minimizeToTray}
                                onChange={this.handleMinimizeToTrayChange}
                            />
                        }
                        label={t("Minimize to tray")}
                    />
                </Grid>

                {/* enable google analytics */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="set-analytics-enabled"
                                checked={!!this.props.analyticsEnabled}
                                onChange={this.handleAnalyticsEnabledChange}
                            />
                        }
                        label={t("Allow basic and anonymous Google Analytics tracking")}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FilePicker
                        buttonContent={"Change settings location"}
                        extensions={["json"]}
                        properties={["openDirectory", "promptToCreate"]}
                        value={this.props.settingsLocation}
                        defaultPath={path.dirname(this.props.settingsLocation)}
                        onChange={this.displayImportDialog}
                    />
                </Grid>

                <Grid item xs={12} />

                <Grid item xs={12} sm={4}>
                    <ButtonTranslate variant="contained" component={NavLink} to={"/debug-page"} style={styles.button}>
                        Debug application
                    </ButtonTranslate>
                </Grid>

                <Grid item xs={12} sm={4} />

                <Grid item xs={12} sm={4}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={styles.button}
                        onClick={this.handleResetBunqDesktop}
                    >
                        {clearBunqDesktopText}
                    </Button>
                </Grid>
            </Grid>
        );

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Settings")}`}</title>
                </Helmet>

                <Dialog open={this.state.openImportDialog}>
                    <DialogTitle>Change settings location</DialogTitle>

                    <DialogContent>
                        <DialogContentText>You are about to change the settings location to:</DialogContentText>
                        <DialogContentText>{this.state.importTargetLocation}</DialogContentText>
                        <DialogContentText>
                            Would you like to import the settings file or overwrite the settings currently in
                            bunqDesktop?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <ButtonTranslate variant="contained" onClick={() => this.setState({ openImportDialog: false })}>
                            Cancel
                        </ButtonTranslate>
                        <ButtonTranslate variant="contained" onClick={this.overwriteSettingsFile} color="secondary">
                            Overwrite file
                        </ButtonTranslate>
                        <ButtonTranslate variant="contained" onClick={this.importSettingsFile} color="primary">
                            Import file
                        </ButtonTranslate>
                    </DialogActions>
                </Dialog>

                <Grid item xs={12} sm={2}>
                    <Button onClick={this.props.history.goBack} style={styles.sideButton}>
                        <ArrowBackIcon />
                    </Button>
                    <Button onClick={() => this.props.history.push("/")} style={styles.sideButton}>
                        <HomeIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>{settingsContainer}</Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        syncOnStartup: state.options.sync_on_startup,
        theme: state.options.theme,
        language: state.options.language,
        hideBalance: state.options.hide_balance,
        minimizeToTray: state.options.minimize_to_tray,
        nativeFrame: state.options.native_frame,
        stickyMenu: state.options.sticky_menu,
        analyticsEnabled: state.options.analytics_enabled,
        settingsLocation: state.options.settings_location,
        automaticThemeChange: state.options.automatic_theme_change,

        checkInactivity: state.options.check_inactivity,
        inactivityCheckDuration: state.options.inactivity_check_duration,
        automaticUpdateEnabled: state.options.automatic_update_enabled,
        automaticUpdateSendNotification: state.options.automatic_update_send_notification,
        automaticUpdateDuration: state.options.automatic_update_duration
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        // options and options_drawer handlers
        setSyncOnStartup: syncOnStartup => dispatch(setSyncOnStartup(syncOnStartup)),
        openSnackbar: message => dispatch(openSnackbar(message)),
        setAutomaticThemeChange: automaticThemeChange => dispatch(setAutomaticThemeChange(automaticThemeChange)),
        setTheme: theme => dispatch(setTheme(theme)),
        setLanguage: language => dispatch(setLanguage(language)),
        setLanguage: language => dispatch(setLanguage(language)),
        setNativeFrame: useFrame => dispatch(setNativeFrame(useFrame)),
        setStickyMenu: userStickyMenu => dispatch(setStickyMenu(userStickyMenu)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        setMinimizeToTray: minimizeToTray => dispatch(setMinimizeToTray(minimizeToTray)),
        setAnalyticsEnabled: enabled => dispatch(setAnalyticsEnabled(enabled)),
        toggleInactivityCheck: inactivityCheck => dispatch(toggleInactivityCheck(inactivityCheck)),
        setInactivityCheckDuration: inactivityCheckDuration =>
            dispatch(setInactivityCheckDuration(inactivityCheckDuration)),
        toggleAutomaticUpdatesEnabled: updateAutomatically =>
            dispatch(toggleAutomaticUpdatesEnabled(updateAutomatically)),
        toggleAutomaticUpdatesSendNotification: sendNotifcation =>
            dispatch(toggleAutomaticUpdatesSendNotification(sendNotifcation)),
        setAutomaticUpdateDuration: automaticUpdateDuration =>
            dispatch(setAutomaticUpdateDuration(automaticUpdateDuration)),
        overwriteSettingsLocation: location => dispatch(overwriteSettingsLocation(location)),
        loadSettingsLocation: location => dispatch(loadSettingsLocation(location)),

        // clear api key from bunqjsclient and bunqdesktop
        clearPrivateData: () => dispatch(registrationClearPrivateData(BunqJSClient)),
        // logout of current session without destroying stored keys
        logOut: () => dispatch(registrationLogOut(BunqJSClient)),
        // full hard reset off all storage
        resetApplication: () => dispatch(resetApplication())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Settings));

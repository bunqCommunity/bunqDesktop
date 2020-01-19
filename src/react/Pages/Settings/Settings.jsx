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
import TextField from "@material-ui/core/TextField";
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

import path from "../../ImportWrappers/path";
import { getPrettyLanguage } from "../../Functions/Utils";

const packageInfo = require("../../../../package.json");
const SUPPORTED_LANGUAGES = packageInfo.supported_languages;

import EditPasswordForm from "./EditPasswordForm";
import NavLink from "../../Components/Routing/NavLink";
import FilePicker from "../../Components/FormFields/FilePicker";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import { openSnackbar } from "../../Actions/snackbar";
import {
    resetApplication,
    setSyncOnStartup,
    setHideBalance,
    setMinimizeToTray,
    setDisplayTrayInfo,
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
    toggleAutomaticUpdatesSendNotification,
    setEventCountLimit
} from "../../Actions/options";
import { registrationClearPrivateData, registrationLogOut } from "../../Actions/registration";
import { paymentsClear } from "../../Actions/payments";
import { masterCardActionsClear } from "../../Actions/master_card_actions";
import { bunqMeTabsClear } from "../../Actions/bunq_me_tabs";
import { scheduledPaymentsClear } from "../../Actions/scheduled_payments";
import { requestInquiryBatchesClear } from "../../Actions/request_inquiry_batches";
import { requestResponsesClear } from "../../Actions/request_responses";
import { requestInquiriesClear } from "../../Actions/request_inquiries";
import { shareInviteBankInquiriesClear } from "../../Actions/share_invite_monetary_account_inquiries";
import { shareInviteMonetaryAccountResponsesClear } from "../../Actions/share_invite_monetary_account_responses";

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
    textField: {
        width: "100%"
    },
    button: {
        width: "100%",
        textAlign: "center"
    },
    paper: {
        padding: 24,
        marginBottom: 16
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
            importTargetLocation: "",

            newPassword: "",
            newPasswordTouched: false,
            newPasswordValid: false
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
        this.props.registrationLogOut();

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
    handleDisplayTrayInfoChange = event => {
        this.props.setDisplayTrayInfo(!this.props.displayTrayInfo);
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
    handleEventCountLimitChange = event => {
        this.props.setEventCountLimit(event.target.value);
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

    resetRequestData = e => {
        this.props.requestInquiriesClear();
        this.props.requestResponsesClear();
        this.props.requestInquiryBatchesClear();
    };
    requestConnectData = e => {
        this.props.shareInviteBankInquiriesClear();
        this.props.shareInviteMonetaryAccountResponsesClear();
    };
    resetAllEventData = e => {
        this.props.paymentsClear();
        this.props.masterCardActionsClear();
        this.props.bunqMeTabsClear();
        this.props.scheduledPaymentsClear();
        this.props.paymentsClear();
        this.resetRequestData();
        this.requestConnectData();
    };

    render() {
        const t = this.props.t;

        const clearBunqDesktopText1 = t("Are you absolutely sure");
        const clearBunqDesktopTex2 = t("Reset bunqDesktop");
        const clearBunqDesktopText = this.state.clearConfirmation ? clearBunqDesktopText1 : clearBunqDesktopTex2;

        const settingsContainer = (
            <Grid container spacing={16}>
                <Grid item xs={12} md={6} lg={8}>
                    <TranslateTypography variant="h5">Settings</TranslateTypography>
                </Grid>

                <Grid item xs={6} md={3} lg={2}>
                    <Button variant="outlined" color="secondary" style={styles.button} onClick={this.clearPrivateData}>
                        {t("Remove keys")} <RemoveIcon />
                    </Button>
                </Grid>

                <Grid item xs={6} md={3} lg={2}>
                    <Button variant="outlined" color="primary" style={styles.button} onClick={this.logout}>
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
                                <MenuItem value={themeKey}>{t(humanReadableThemes[themeKey])}</MenuItem>
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
                            <MenuItem key={60} value={60}>
                                1 {t("Minute")}
                            </MenuItem>
                            <MenuItem key={120} value={120}>
                                2 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={300} value={300}>
                                5 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={600} value={600}>
                                10 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={1800} value={1800}>
                                30 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={3600} value={3600}>
                                1 {t("Hour")}
                            </MenuItem>
                            <MenuItem key={7200} value={7200}>
                                2 {t("Hours")}
                            </MenuItem>
                        </Select>
                    </Grid>
                ) : null}

                {/* send events if new events are found in an automatic sync */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
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
                            <Switch checked={this.props.syncOnStartup} onChange={this.handleSyncOnStartupChange} />
                        }
                        label={t("Run background sync on startup")}
                    />
                </Grid>

                {/* hide account balances */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch checked={this.props.hideBalance} onChange={this.handleHideBalanceCheckChange} />
                        }
                        label={t("Hide account balances")}
                    />
                </Grid>

                {/* use native frame */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch checked={this.props.nativeFrame} onChange={this.handleNativeFrameCheckChange} />
                        }
                        label={t("Use the native frame")}
                    />
                </Grid>

                {/* use sticky menu */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={<Switch checked={this.props.stickyMenu} onChange={this.handleStickyMenuCheckChange} />}
                        label={t("Enable sticky menu")}
                    />
                </Grid>

                {/* change theme based on time */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
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
                            <MenuItem key={60} value={60}>
                                1 {t("Minute")}
                            </MenuItem>
                            <MenuItem key={120} value={120}>
                                2 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={300} value={300}>
                                5 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={600} value={600}>
                                10 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={1800} value={1800}>
                                30 {t("Minutes")}
                            </MenuItem>
                            <MenuItem key={3600} value={3600}>
                                1 {t("Hour")}
                            </MenuItem>
                            <MenuItem key={7200} value={7200}>
                                2 {t("Hours")}
                            </MenuItem>
                        </Select>
                    ) : null}
                </Grid>

                {/* minimize to tray */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch checked={this.props.minimizeToTray} onChange={this.handleMinimizeToTrayChange} />
                        }
                        label={t("Minimize to tray")}
                    />
                </Grid>

                {/* display account info and total balance */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch checked={this.props.displayTrayInfo} onChange={this.handleDisplayTrayInfoChange} />
                        }
                        label={t("Display user info in the tray menu")}
                    />
                </Grid>

                {/* enable google analytics */}
                <Grid item xs={12} md={6}>
                    <FormControlLabel
                        control={
                            <Switch
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
                    <TranslateButton variant="outlined" component={NavLink} to={"/debug-page"} style={styles.button}>
                        Debug application
                    </TranslateButton>
                </Grid>

                <Grid item xs={12} sm={4} />

                <Grid item xs={12} sm={4}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        style={styles.button}
                        onClick={this.handleResetBunqDesktop}
                    >
                        {clearBunqDesktopText}
                    </Button>
                </Grid>
            </Grid>
        );

        const paymentCount = this.props.payments.length;
        const cardPaymentCount = this.props.masterCardActions.length;
        const requestCount = this.props.requestInquiries.length + this.props.requestResponses.length;
        const bunqMeTabsCount = this.props.bunqMeTabs.length;
        const connectCount =
            this.props.shareInviteBankInquiries.length + this.props.shareInviteMonetaryAccountResponses.length;
        const scheduledPaymentsCount = this.props.scheduledPayments.length;

        const dataManagementContainer = (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <TranslateTypography variant="h5">Data options</TranslateTypography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={styles.formControl}>
                        <InputLabel>{t("Events to load per type and account")}</InputLabel>
                        <Select
                            style={styles.selectField}
                            value={this.props.eventCountLimit}
                            onChange={this.handleEventCountLimitChange}
                        >
                            <MenuItem key={50} value={50}>
                                50 {t("events")}
                            </MenuItem>
                            <MenuItem key={100} value={100}>
                                100 {t("events")}
                            </MenuItem>
                            <MenuItem key={200} value={200}>
                                200 {t("events")}
                            </MenuItem>
                            <MenuItem key={400} value={400}>
                                400 {t("events")}
                            </MenuItem>
                            <MenuItem key={600} value={600}>
                                600 {t("events")}
                            </MenuItem>
                            <MenuItem key={1000} value={1000}>
                                1000 {t("events")}
                            </MenuItem>
                            <MenuItem key={99999} value={99999}>
                                Everything
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TranslateTypography variant="body2" style={{ marginTop: 8 }}>
                        More events might cause performance issues and take longer to update
                    </TranslateTypography>
                </Grid>

                <Grid item xs={12}>
                    <TranslateTypography variant="h5">Data management</TranslateTypography>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TranslateTypography variant="body2">
                        Click any button to reset the data, the counter only displays the amount of payments currently
                        loaded into memory but resetting will also remove the data from storage
                    </TranslateTypography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TranslateButton
                        variant="outlined"
                        color="secondary"
                        style={styles.button}
                        onClick={this.resetAllEventData}
                    >
                        Reset all event data
                    </TranslateButton>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.props.paymentsClear}>
                        {t("Regular payments")} {paymentCount}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.props.masterCardActionsClear}>
                        {t("Card payments")} {cardPaymentCount}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.resetRequestData}>
                        {t("Requests")} {requestCount}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.props.bunqMeTabsClear}>
                        {t("bunqme Tabs")} {bunqMeTabsCount}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.requestConnectData}>
                        {t("Connect requests")} {connectCount}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Button variant="outlined" style={styles.button} onClick={this.props.scheduledPaymentsClear}>
                        {t("Scheduled payments")} {scheduledPaymentsCount}
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
                        <TranslateButton variant="contained" onClick={() => this.setState({ openImportDialog: false })}>
                            Cancel
                        </TranslateButton>
                        <TranslateButton variant="contained" onClick={this.overwriteSettingsFile} color="secondary">
                            Overwrite file
                        </TranslateButton>
                        <TranslateButton variant="contained" onClick={this.importSettingsFile} color="primary">
                            Import file
                        </TranslateButton>
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
                    {this.props.registrationReady && (
                        <Paper style={styles.paper}>
                            <EditPasswordForm />
                        </Paper>
                    )}
                    <Paper style={styles.paper}>{dataManagementContainer}</Paper>
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
        displayTrayInfo: state.options.display_tray_info,
        nativeFrame: state.options.native_frame,
        stickyMenu: state.options.sticky_menu,
        eventCountLimit: state.options.event_count_limit,
        analyticsEnabled: state.options.analytics_enabled,
        settingsLocation: state.options.settings_location,
        automaticThemeChange: state.options.automatic_theme_change,

        payments: state.payments.payments,
        scheduledPayments: state.scheduled_payments.scheduled_payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        masterCardActions: state.master_card_actions.master_card_actions,
        requestInquiries: state.request_inquiries.request_inquiries,
        requestInquiryBatches: state.request_inquiry_batches.request_inquiry_batches,
        requestResponses: state.request_responses.request_responses,
        shareInviteBankInquiries: state.share_invite_monetary_account_inquiries.share_invite_monetary_account_inquiries,
        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

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
        // options and options_drawer handlers
        setSyncOnStartup: syncOnStartup => dispatch(setSyncOnStartup(syncOnStartup)),
        openSnackbar: message => dispatch(openSnackbar(message)),
        setAutomaticThemeChange: automaticThemeChange => dispatch(setAutomaticThemeChange(automaticThemeChange)),
        setTheme: theme => dispatch(setTheme(theme)),
        setLanguage: language => dispatch(setLanguage(language)),
        setNativeFrame: useFrame => dispatch(setNativeFrame(useFrame)),
        setStickyMenu: userStickyMenu => dispatch(setStickyMenu(userStickyMenu)),
        setEventCountLimit: eventCountLimit => dispatch(setEventCountLimit(eventCountLimit)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        setMinimizeToTray: minimizeToTray => dispatch(setMinimizeToTray(minimizeToTray)),
        setDisplayTrayInfo: displayTrayInfo => dispatch(setDisplayTrayInfo(displayTrayInfo)),
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

        paymentsClear: () => dispatch(paymentsClear()),
        masterCardActionsClear: () => dispatch(masterCardActionsClear()),
        bunqMeTabsClear: () => dispatch(bunqMeTabsClear()),
        scheduledPaymentsClear: () => dispatch(scheduledPaymentsClear()),
        requestInquiriesClear: () => dispatch(requestInquiriesClear()),
        requestResponsesClear: () => dispatch(requestResponsesClear()),
        requestInquiryBatchesClear: () => dispatch(requestInquiryBatchesClear()),
        shareInviteBankInquiriesClear: () => dispatch(shareInviteBankInquiriesClear()),
        shareInviteMonetaryAccountResponsesClear: () => dispatch(shareInviteMonetaryAccountResponsesClear()),

        // clear api key from bunqjsclient and bunqdesktop
        clearPrivateData: () => dispatch(registrationClearPrivateData()),
        // logout of current session without destroying stored keys
        registrationLogOut: () => dispatch(registrationLogOut()),
        // full hard reset off all storage
        resetApplication: () => dispatch(resetApplication())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Settings));

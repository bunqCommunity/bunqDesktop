import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Select from "material-ui/Select";
import Paper from "material-ui/Paper";
import Switch from "material-ui/Switch";
import Typography from "material-ui/Typography";

import ArrowBackIcon from "material-ui-icons/ArrowBack";

const remote = require("electron").remote;

import NavLink from "../Components/Routing/NavLink";
import { openSnackbar } from "../Actions/snackbar";
import {
    resetApplication,
    setHideBalance,
    setInactivityCheckDuration,
    setMinimizeToTray,
    setNativeFrame,
    setStickyMenu,
    setTheme,
    toggleInactivityCheck
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
        width: "100%"
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
            clearConfirmation: false
        };
    }

    handleThemeChange = event => {
        this.props.setTheme(event.target.value);
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

    render() {
        const clearBunqDesktopText = this.state.clearConfirmation
            ? "Are you absolutely sure?"
            : "Reset BunqDesktop";

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Settings`}</title>
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
                        <Grid container spacing={24} justify={"center"}>
                            <Grid item xs={6} sm={8} md={9} lg={10}>
                                <Typography variant={"headline"}>
                                    Settings
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <Button
                                    variant="raised"
                                    color="secondary"
                                    style={styles.button}
                                    onClick={this.props.clearApiKey}
                                >
                                    Logout
                                </Button>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl style={styles.formControl}>
                                    <InputLabel htmlFor="theme-selection">
                                        Theme
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

                            <Grid item xs={6}>
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
                                    label="Use the native frame"
                                />
                            </Grid>

                            <Grid item xs={6}>
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
                                    label="Minimize to tray"
                                />
                            </Grid>

                            <Grid item xs={6}>
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
                                    label="Enable sticky menu"
                                />
                            </Grid>

                            <Grid item xs={6}>
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
                                    label="Hide account balances"
                                />
                            </Grid>

                            <Grid item xs={6}>
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
                                    label="Logout automatically"
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
                                        <MenuItem key={60} value={60}>
                                            1 Minute
                                        </MenuItem>
                                        <MenuItem key={120} value={120}>
                                            2 Minutes
                                        </MenuItem>
                                        <MenuItem key={300} value={300}>
                                            5 Minutes
                                        </MenuItem>
                                        <MenuItem key={600} value={600}>
                                            10 Minutes
                                        </MenuItem>
                                        <MenuItem key={1800} value={1800}>
                                            30 Minutes
                                        </MenuItem>
                                        <MenuItem key={3600} value={3600}>
                                            1 Hour
                                        </MenuItem>
                                        <MenuItem key={7200} value={7200}>
                                            2 Hours
                                        </MenuItem>
                                    </Select>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    component={NavLink}
                                    to={"/"}
                                    style={styles.button}
                                >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="raised"
                                    component={NavLink}
                                    to={"/debug-page"}
                                    style={styles.button}
                                >
                                    Debug
                                </Button>
                            </Grid>
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
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme,
        hideBalance: state.options.hide_balance,
        minimizeToTray: state.options.minimize_to_tray,
        nativeFrame: state.options.native_frame,
        stickyMenu: state.options.sticky_menu,
        checkInactivity: state.options.check_inactivity,
        inactivityCheckDuration: state.options.inactivity_check_duration
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        // options and options_drawer handlers
        openSnackbar: message => dispatch(openSnackbar(message)),
        setTheme: theme => dispatch(setTheme(theme)),
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

        // clear api key from bunqjsclient and bunqdesktop
        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),
        // full hard reset off all storage
        resetApplication: () => dispatch(resetApplication())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

import React from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListSubheader, ListItemIcon } from "material-ui/List";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Select from "material-ui/Select";
import Switch from "material-ui/Switch";
import Typography from "material-ui/Typography";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import TextField from "material-ui/TextField";

import {
    setTheme,
    setNativeFrame,
    setHideBalance,
    toggleInactivityCheck,
    setInactivityCheckDuration
} from "../Actions/options";
import { closeOptionsDrawer } from "../Actions/options_drawer";
import { openMainDrawer } from "../Actions/main_drawer";
import { openSnackbar } from "../Actions/snackbar";

const styles = {
    list: {
        width: 250,
        paddingBottom: 50,
        display: "flex",
        flexDirection: "column",
        WebkitAppRegion: "no-drag"
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listFiller: {
        flex: "1 1 100%"
    },
    listBottomItem: {
        flex: 0
    },
    formControl: {
        width: "100%"
    },
    selectField: {
        width: "100%"
    },
    avatar: {
        width: 50,
        height: 50
    },
    bunqLink: {
        marginBottom: 20,
        color: "inherit",
        textDecoration: "none"
    }
};

class OptionsDrawer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    backToMain = () => {
        // open the options drawer and open the main drawer
        this.props.openMainDrawer();
        this.props.closeOptionsDrawer();
    };

    handleThemeChange = event => {
        this.props.setTheme(event.target.value);
    };

    handleNativeFrameCheckChange = event => {
        this.props.openSnackbar(
            "Restart the application to view these changes!"
        );
        this.props.setNativeFrame(!this.props.nativeFrame);
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

    render() {
        const { theme, open } = this.props;

        const drawerList = (
            <List style={styles.list}>
                <ListSubheader>Options</ListSubheader>
                <ListItem>
                    <FormControl style={styles.formControl}>
                        <InputLabel htmlFor="theme-selection">Theme</InputLabel>
                        <Select
                            value={theme}
                            onChange={this.handleThemeChange}
                            input={<Input id="theme-selection" />}
                            style={styles.selectField}
                        >
                            {Object.keys(this.props.themeList).map(themeKey => (
                                <MenuItem value={themeKey}>{themeKey}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        control={
                            <Switch
                                id="nativeframe-selection"
                                checked={this.props.nativeFrame}
                                onChange={this.handleNativeFrameCheckChange}
                            />
                        }
                        label="Use the native frame"
                    />
                </ListItem>

                {console.log(this.props.checkInactivity)}
                {console.log(this.props.inactivityCheckDuration)}

                <ListItem>
                    <FormControlLabel
                        control={
                            <Switch
                                id="inactivity-check-selection"
                                checked={this.props.checkInactivity}
                                onChange={this.handleHideInactivityCheckChange}
                            />
                        }
                        label="Logout automatically"
                    />
                    {this.props.checkInactivity ? (
                        <Select
                            value={this.props.inactivityCheckDuration}
                            onChange={this.handleHideInactivityDurationChange}
                        >
                            <MenuItem key={60} value={60}>1 Minute</MenuItem>
                            <MenuItem key={120} value={120}>2 Minutes</MenuItem>
                            <MenuItem key={300} value={300}>5 Minutes</MenuItem>
                            <MenuItem key={600} value={600}>10 Minutes</MenuItem>
                            <MenuItem key={1800} value={1800}>30 Minutes</MenuItem>
                            <MenuItem key={3600} value={3600}>1 Hour</MenuItem>
                            <MenuItem key={7200} value={7200}>2 Hours</MenuItem>
                        </Select>
                    ) : null}
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        control={
                            <Switch
                                id="hide-balance-selection"
                                checked={this.props.hideBalance}
                                onChange={this.handleHideBalanceCheckChange}
                            />
                        }
                        label="Hide monetary account balances"
                    />
                </ListItem>

                <ListItem style={styles.listFiller} />

                <ListItem
                    button
                    style={styles.listBottomItem}
                    onClick={this.backToMain}
                >
                    <ListItemIcon>
                        <ArrowBackIcon />
                    </ListItemIcon>
                    <Typography type="subheading">Back</Typography>
                </ListItem>
            </List>
        );

        return (
            <Drawer
                open={open}
                className="options-drawer"
                onRequestClose={this.props.closeOptionsDrawer}
                anchor={theme.direction === "rtl" ? "right" : "left"}
                SlideProps={{
                    style: { top: 50 }
                }}
            >
                {drawerList}
            </Drawer>
        );
    }
}

const mapStateToProps = state => {
    return {
        open: state.options_drawer.open,
        theme: state.options.theme,
        hideBalance: state.options.hide_balance,
        nativeFrame: state.options.native_frame,
        checkInactivity: state.options.check_inactivity,
        inactivityCheckDuration: state.options.inactivity_check_duration
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setTheme: theme => dispatch(setTheme(theme)),
        setNativeFrame: useFrame => dispatch(setNativeFrame(useFrame)),
        setHideBalance: hideBalance => dispatch(setHideBalance(hideBalance)),
        toggleInactivityCheck: inactivityCheck =>
            dispatch(toggleInactivityCheck(inactivityCheck)),
        setInactivityCheckDuration: inactivityCheckDuration =>
            dispatch(setInactivityCheckDuration(inactivityCheckDuration)),
        openMainDrawer: () => dispatch(openMainDrawer()),
        closeOptionsDrawer: () => dispatch(closeOptionsDrawer())
    };
};

OptionsDrawer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(OptionsDrawer)
);

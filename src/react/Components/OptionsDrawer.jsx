import React from "react";
import { connect } from "react-redux";
import { withTheme } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import List, {
    ListItem,
    ListSubheader,
    ListItemText,
    ListItemIcon
} from "material-ui/List";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Typography from "material-ui/Typography";
import Select from "material-ui/Select";
import Avatar from "material-ui/Avatar";
import PowerSettingsIcon from "material-ui-icons/PowerSettingsNew";
import PaymentIcon from "material-ui-icons/Payment";

import NavLink from "./Routing/NavLink";
import { setTheme } from "../Actions/theme";
import { closeDrawer } from "../Actions/options_drawer";

const styles = {
    list: {
        width: 250,
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
        this.state = {
            open: false
        };
    }

    closeDrawer = () => {
        this.setState({ open: false });
    };

    handleThemeChange = event => {
        this.props.setTheme(event.target.value);
    };

    closeApp() {
        window.close();
    }

    render() {
        const { theme, open } = this.props;

        const drawerList = (
            <List style={styles.list}>
                <a
                    className="js-external-link"
                    style={styles.bunqLink}
                    href="https://github.com/BunqCommunity/BunqDesktop"
                    target="_blank"
                >
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar
                                style={styles.avatar}
                                src="./images/512x512.png"
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary="BunqDesktop"
                            secondary={`Version ${CURRENT_VERSION}`}
                        />
                    </ListItem>
                </a>

                <ListItem
                    button
                    style={styles.listBottomItem}
                    component={NavLink}
                    to="/pay"
                >
                    <ListItemIcon>
                        <PaymentIcon />
                    </ListItemIcon>
                    <Typography type="subheading">Create payment</Typography>
                </ListItem>

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

                <ListItem style={styles.listFiller} />
                <ListItem
                    button
                    style={styles.listBottomItem}
                    onClick={this.closeApp}
                >
                    <ListItemIcon>
                        <PowerSettingsIcon />
                    </ListItemIcon>
                    <Typography type="subheading">Quit BunqDesktop</Typography>
                </ListItem>
            </List>
        );

        return [
            <Drawer
                open={open}
                onRequestClose={this.props.closeDrawer}
                anchor="left"
                className="options-drawer"
                SlideProps={{
                    style: { top: 50, height: "calc(100vh - 50px)" }
                }}
            >
                {drawerList}
            </Drawer>
        ];
    }
}

const mapStateToProps = state => {
    return {
        open: state.options_drawer.open,
        theme: state.theme.theme
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTheme: theme => dispatch(setTheme(theme)),
        closeDrawer: () => dispatch(closeDrawer())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme(OptionsDrawer)
);

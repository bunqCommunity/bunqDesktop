import React from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListSubheader, ListItemIcon } from "material-ui/List";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Typography from "material-ui/Typography";
import ArrowBackIcon from "material-ui-icons/ArrowBack";

import { setTheme } from "../Actions/theme";
import { closeOptionsDrawer } from "../Actions/options_drawer";
import { openMainDrawer } from "../Actions/main_drawer";

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
        theme: state.theme.theme
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setTheme: theme => dispatch(setTheme(theme)),
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

import React from "react";
import { withTheme } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListSubheader } from "material-ui/List";
import { connect } from "react-redux";
import { setTheme } from "../Actions/theme";
import { closeDrawer } from "../Actions/options_drawer";

import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import Select from "material-ui/Select";

const styles = {
    list: {
        width: 250
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    formControl: {
        width: "100%"
    },
    selectField: {
        width: "100%"
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
            </List>
        );

        return [
            <Drawer
                open={open}
                onRequestClose={this.props.closeDrawer}
                anchor="left"
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

import React from "react";
import PropTypes from "prop-types";
import WindowedList from "react-windowed-list";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog  from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import Icons from "../../Helpers/Icons";
import {translate} from "react-i18next";

const styles = {
    iconContainer: {
        height: 500,
        width: 600,
        overflow: "auto"
    },
    searchInput: {
        width: "95%",
        margin: 8
    }
};

class IconPicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            searchTerm: "",
            icons: Icons.icons
        };
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    changeSearchTerm = event => {
        const searchTerm = event.target.value.trim().toLowerCase();

        // only filter if search term isn't empty
        if (searchTerm.length > 0) {
            // loop through items and match
            let iconList = Icons.icons.filter(icon => {
                const alternateIcon = icon.replace("_", " ");
                return (
                    icon.includes(searchTerm) ||
                    alternateIcon.includes(searchTerm)
                );
            });

            this.setState({
                icons: iconList,
                searchTerm: searchTerm
            });
        } else {
            this.setState({ searchTerm: searchTerm, icons: Icons.icons });
        }
    };

    selectIcon = icon => event => {
        this.props.onClick(icon);
        this.handleClose();
    };

    itemRenderer = (index, key) => {
        const icon = this.state.icons[index];
        return (
            <IconButton key={key} onClick={this.selectIcon(icon)}>
                <Icon>{icon}</Icon>
            </IconButton>
        );
    };

    render() {
        return (
            <div style={this.props.style}>
                <Button
                    key={"randomkey1"}
                    variant="raised"
                    color="default"
                    onClick={this.handleOpen}
                    style={this.props.buttonStyle}
                    {...this.props.buttonProps}
                >
                    {this.props.buttonLabel}
                </Button>
                <Dialog
                    key={"randomkey2"}
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>{this.props.t("Pick an icon")}</DialogTitle>
                    <TextField
                        label={"Search for icons"}
                        style={styles.searchInput}
                        value={this.state.searchTerm}
                        onChange={this.changeSearchTerm}
                    />
                    <div style={styles.iconContainer}>
                        <WindowedList
                            isLazy
                            itemRenderer={this.itemRenderer}
                            length={this.state.icons.length}
                            type="uniform"
                        />
                    </div>
                </Dialog>
            </div>
        );
    }
}

IconPicker.defaultProps = {
    buttonLabel: "Pick an icon",
    style: {},
    buttonStyle: {},
    buttonProps: {}
};

IconPicker.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default translate("translations")(IconPicker);

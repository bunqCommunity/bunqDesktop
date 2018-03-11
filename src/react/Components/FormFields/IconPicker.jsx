import React from "react";
import PropTypes from "prop-types";
import WindowedList from "react-windowed-list";
import Icon from "material-ui/Icon";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Dialog, { DialogTitle } from "material-ui/Dialog";

import Icons from "../../Helpers/Icons";

const styles = {
    iconContainer: {
        height: 500,
        overflow: "auto"
    }
};

class IconPicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    selectIcon = icon => event => {
        this.props.onClick(icon);
        this.handleClose();
    };

    itemRenderer = (index, key) => {
        const icon = Icons.icons[index];
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
                    raised
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
                    <DialogTitle>Pick an icon</DialogTitle>
                    <div style={styles.iconContainer}>
                        <WindowedList
                            isLazy
                            itemRenderer={this.itemRenderer}
                            length={Icons.icons.length}
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

export default IconPicker;

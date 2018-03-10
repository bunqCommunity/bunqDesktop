import React from "react";
import PropTypes from "prop-types";
import Icon from "material-ui/Icon";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Dialog, { DialogTitle } from "material-ui/Dialog";

import Icons from "../Helpers/Icons";

class IconPicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.open !== this.props.open) return true;

        return false;
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    selectIcon = icon => event => {
        this.props.onClick(icon);
    };

    render() {
        return (
            <div>
                <Button
                    key={"randomkey1"}
                    raised
                    color="primary"
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
                    <div>
                        {Icons.icons.map((icon, iconIndex) => {
                            return (
                                <IconButton
                                    key={iconIndex}
                                    onClick={this.selectIcon(icon)}
                                >
                                    <Icon>{icon}</Icon>
                                </IconButton>
                            );
                        })}
                    </div>
                </Dialog>
            </div>
        );
    }
}

IconPicker.defaultProps = {
    buttonLabel: "Pick an icon",
    buttonStyle: {},
    buttonProps: {}
};

IconPicker.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default IconPicker;

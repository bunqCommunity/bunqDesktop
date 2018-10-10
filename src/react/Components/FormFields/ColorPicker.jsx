import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import ChromePicker from "react-color/lib/Chrome";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

const styles = {
    popover: {
        position: "absolute",
        zIndex: 2
    },
    cover: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
};

class ColorPicker extends React.Component {
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

    render() {
        return (
            <div style={this.props.style}>
                <Button
                    variant="contained"
                    key={"randomkey1"}
                    color="default"
                    onClick={this.handleOpen}
                    style={this.props.buttonStyle}
                    {...this.props.buttonProps}
                >
                    {this.props.t("Pick a color")}
                </Button>
                <Dialog key={"randomkey2"} open={this.state.open} onClose={this.handleClose}>
                    <ChromePicker {...this.props.pickerProps} />
                </Dialog>
            </div>
        );
    }
}

ColorPicker.defaultProps = {
    style: {},
    buttonStyle: {},
    buttonProps: {}
};

ColorPicker.propTypes = {
    pickerProps: PropTypes.object.isRequired
};

export default translate("translations")(ColorPicker);

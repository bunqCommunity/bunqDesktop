import React from "react";
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

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class ColorPicker extends React.Component<IProps> {
    static defaultProps = {
        style: {},
        buttonStyle: {},
        buttonProps: {}
    };

    state: IState;

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

export default translate("translations")(ColorPicker);

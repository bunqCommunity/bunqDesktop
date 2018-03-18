import React from "react";
import { connect } from "react-redux";
import Button from "material-ui/Button";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

const Transition = props => <Slide direction="left" {...props} />

// redux actions
import { closeModal } from "../Actions/modal.js";

class MainDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Dialog
                open={this.props.modalOpen}
                transition={Transition}
                keepMounted
                onClose={this.props.closeModal}
            >
                <DialogTitle>{this.props.modalTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.modalText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="raised"
                        onClick={this.props.closeModal}
                        color="primary"
                    >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = store => {
    return {
        modalText: store.modal.message,
        modalTitle: store.modal.title,
        modalOpen: store.modal.modalOpen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeModal())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDialog);

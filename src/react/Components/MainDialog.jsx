import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Button from "material-ui/Button";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

// redux actions
import { closeModal } from "../Actions/modal.js";

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Dialog
                open={this.props.modalOpen}
                transition={<Slide direction="up" />}
                keepMounted
                onRequestClose={this.props.closeModal}
            >
                <DialogTitle>{this.props.modalTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.modalText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

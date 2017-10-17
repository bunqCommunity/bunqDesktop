import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Snackbar from "material-ui/Snackbar";
import Slide from "material-ui/transitions/Slide";

// redux actions
import { closeSnackbar } from "../Actions/snackbar.js";

class MainSnackbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Snackbar
                open={this.props.snackbarOpen}
                message={this.props.snackbarMessage}
                autoHideDuration={this.props.snackbarDuration}
                transition={<Slide direction={"down"} />}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onRequestClose={this.props.closeSnackbar}
            />
        );
    }
}

const mapStateToProps = store => {
    return {
        snackbarMessage: store.snackbar.message,
        snackbarDuration: store.snackbar.duration,
        snackbarOpen: store.snackbar.snackbarOpen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeSnackbar: () => dispatch(closeSnackbar())
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MainSnackbar)
);

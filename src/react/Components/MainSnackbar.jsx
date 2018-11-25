import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
const Transition = props => <Slide direction={"down"} {...props} />;

// redux actions
import { closeSnackbar } from "../Actions/snackbar.js";

const styles = {
    snackbar: {
        marginTop: 50
    }
};

class MainSnackbar extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Snackbar
                ContentProps={{
                    headlineMapping: {
                        body1: "div",
                        body2: "div"
                    }
                }}
                style={styles.snackbar}
                open={this.props.snackbarOpen}
                message={this.props.snackbarMessage}
                autoHideDuration={this.props.snackbarDuration}
                TransitionComponent={Transition}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={this.props.closeSnackbar}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainSnackbar);

import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";

const Transition = props => <Slide direction={"down"} {...props} />;

// redux actions
import { actions as snackbarActions } from "~store/snackbar";

const styles: any = {
    snackbar: {
        marginTop: 50
    }
};

class MainSnackbar extends React.PureComponent<any> {
    state: any;

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
        closeSnackbar: () => dispatch(snackbarActions.close())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainSnackbar);

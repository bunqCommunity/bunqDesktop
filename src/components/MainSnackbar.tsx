import React from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { AppDispatch, ReduxState } from "~store/index";

const Transition = props => <Slide direction={"down"} {...props} />;

// redux actions
import { actions as snackbarActions } from "~store/snackbar";

const styles: any = {
    snackbar: {
        marginTop: 50
    }
};

interface IState {
}

interface IProps {
}

class MainSnackbar extends React.PureComponent<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

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

const mapStateToProps = (state: ReduxState) => {
    return {
        snackbarMessage: state.snackbar.message,
        snackbarDuration: state.snackbar.duration,
        snackbarOpen: state.snackbar.snackbarOpen
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        closeSnackbar: () => dispatch(snackbarActions.close())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainSnackbar);

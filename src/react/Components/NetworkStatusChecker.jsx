import React from "react";
import axios from "axios";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";

import RefreshIcon from "@material-ui/icons/Refresh";

import { applicationSetOffline, applicationSetOnline } from "../Actions/application";

const Transition = props => <Slide direction={"down"} {...props} />;

const styles = {
    snackbar: {
        marginTop: 50
    }
};

class NetworkStatusChecker extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false
        };

        // event listeners to detect network changes
        window.addEventListener("offline", this.onNetworkChange);
        window.addEventListener("online", this.onNetworkChange);
    }

    componentDidMount() {
        this.onNetworkChange();
    }

    /**
     * Checks the navigator status for the onLine status
     * @param event
     */
    onNetworkChange = () => {
        if (navigator.onLine) {
            this.props.applicationSetOnline();
        } else {
            this.props.applicationSetOffline();
        }
    };

    /**
     * Does a request to check if network is active
     */
    checkNetWorkStatus = () => {
        axios
            .get("https://api.bunq.com/v1/user")
            .then(response => {
                this.props.applicationSetOnline();
            })
            .catch(error => {
                if (error.toString() !== "Error: Network Error") {
                    this.props.applicationSetOnline();
                    return;
                }
                this.props.applicationSetOffline();
            });
    };

    render() {
        return (
            <Snackbar
                style={styles.snackbar}
                open={!this.props.online}
                message={this.props.t("Network seems to be offline")}
                TransitionComponent={Transition}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Check again"
                        color="secondary"
                        onClick={this.checkNetWorkStatus}
                        disabled={this.state.loading}
                    >
                        <RefreshIcon />
                    </IconButton>
                ]}
            />
        );
    }
}

const mapStateToProps = store => {
    return {
        online: store.application.online
    };
};

const mapDispatchToProps = dispatch => {
    return {
        applicationSetOnline: () => dispatch(applicationSetOnline()),
        applicationSetOffline: () => dispatch(applicationSetOffline())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(NetworkStatusChecker));

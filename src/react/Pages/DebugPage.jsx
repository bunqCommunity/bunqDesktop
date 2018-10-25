import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import ReactJson from "react-json-view";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import ReactJsonWrapper from "../Components/ReactJsonWrapper";

const styles = {
    paper: {
        padding: 24
    }
};

class DebugPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const registrationInfo = this.props.reduxState.registration;
        const modifiedState = {
            ...this.props.reduxState,
            registration: {
                ...registrationInfo,
                api_key: registrationInfo.api_key ? "HIDDEN" : registrationInfo.api_key,
                derivedPassword: registrationInfo.derivedPassword ? "HIDDEN" : registrationInfo.derivedPassword
            }
        };

        return (
            <Grid container spacing={24} justify={"center"}>
                <Helmet>
                    <title>{`bunqDesktop - Debug page`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <Button onClick={() => this.props.history.push("/")}>Home</Button>
                </Grid>

                <Grid item xs={12}>
                    <ReactJsonWrapper style={styles.paper} data={modifiedState} name="bunqDesktopState" />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        reduxState: state
    };
};

export default connect(mapStateToProps)(DebugPage);

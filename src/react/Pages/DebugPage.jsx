import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import ReactJson from "react-json-view";
import Grid from "material-ui/Grid";

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
                api_key: registrationInfo.api_key
                    ? "HIDDEN"
                    : registrationInfo.api_key,
                derivedPassword: registrationInfo.derivedPassword
                    ? "HIDDEN"
                    : registrationInfo.derivedPassword
            }
        };

        return (
            <Grid container spacing={24} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Debug page`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <ReactJson
                        style={styles.paper}
                        src={modifiedState}
                        name="BunqDesktopState"
                        theme="monokai"
                        iconStyle="square"
                        enableEdit={false}
                        enableAdd={false}
                        enabledDelete={false}
                        enableClipboard={true}
                        displayDataTypes={true}
                        displayObjectSize={true}
                        indentWidth={2}
                        collapsed={1}
                        collapseStringsAfterLength={30}
                    />
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

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DebugPage);

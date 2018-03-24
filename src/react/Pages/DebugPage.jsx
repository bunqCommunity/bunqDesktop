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
        return (
            <Grid container spacing={24} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Debug page`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <ReactJson
                        style={styles.paper}
                        src={this.props.reduxState}
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

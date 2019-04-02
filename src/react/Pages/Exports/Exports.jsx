import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import CustomExports from "./CustomExports";
import OfficialExports from "./OfficialExports";

const styles = {
    appbar: {
        marginBottom: 12
    }
};

class Exports extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedTab: 0
        };
    }

    render() {
        const { t, limitedPermissions } = this.props;

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Exports")}`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <AppBar style={styles.appbar} position="static">
                        <Tabs
                            value={this.state.selectedTab}
                            onChange={(event, value) => this.setState({ selectedTab: value })}
                        >
                            {limitedPermissions ? null : <Tab value={0} label={t("bunq Exports")} />}
                            <Tab value={1} label={t("Custom Exports")} />
                        </Tabs>
                    </AppBar>

                    {this.state.selectedTab === 0 ? <OfficialExports BunqJSClient={this.props.BunqJSClient} /> : null}

                    {this.state.selectedTab === 1 ? <CustomExports BunqJSClient={this.props.BunqJSClient} /> : null}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions
    };
};

export default connect(mapStateToProps)(translate("translations")(Exports));

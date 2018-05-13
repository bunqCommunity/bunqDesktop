import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Helmet from "react-helmet";
import store from "store";
import Grid from "material-ui/Grid";
import { FormControlLabel } from "material-ui/Form";
import Card, { CardContent } from "material-ui/Card";
import Checkbox from "material-ui/Checkbox";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";

import WarningIcon from "@material-ui/icons/Warning";
import LockIcon from "@material-ui/icons/Lock";
import HelpIcon from "@material-ui/icons/Help";

import TranslateButton from "../Components/TranslationHelpers/Button";

import Analytics from "../Helpers/Analytics";
import { setAnalyticsEnabled } from "../Actions/options";

const styles = {
    wrapperContainer: {
        height: "100%"
    },
    warningCard: {
        marginTop: 16
    },
    buttons: { marginTop: 16 }
};

class Disclaimer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            hasReadWarning: !!store.get("HAS_READ_DEV_WARNING"),

            clicked: false
        };
    }

    ignoreWarning = event => {
        store.set("HAS_READ_DEV_WARNING", true);
        this.setState({ hasReadWarning: true, clicked: true });

        const analyticsEnabled = this.props.analyticsEnabled !== false;

        // enable analytics if undefined or true
        this.props.setAnalyticsEnabled(analyticsEnabled);

        // analytics not loaded yet, do it now when enabled
        if (analyticsEnabled) {
            Analytics();
        }
    };

    toggleAnalytics = event => {
        this.props.setAnalyticsEnabled(this.props.analyticsEnabled === false);
    };

    render() {
        const { t, analyticsEnabled } = this.props;
        const { hasReadWarning, clicked } = this.state;

        if (
            clicked === true &&
            hasReadWarning === true &&
            typeof analyticsEnabled !== "undefined"
        ) {
            return <Redirect to="/login" />;
        }

        return (
            <Grid
                container
                spacing={16}
                justify={"center"}
                alignItems={"center"}
                style={styles.wrapperContainer}
            >
                <Helmet>
                    <title>{`BunqDesktop - ${t("Disclaimer")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card>
                        <Card style={styles.warningCard}>
                            <CardContent>
                                <Typography variant="headline">
                                    <WarningIcon /> Caution!
                                </Typography>
                                <Typography variant="body2">
                                    {t("ActiveDevelopmentWarning")}
                                </Typography>
                                <br />
                                <Typography variant="headline">
                                    <LockIcon /> Password
                                </Typography>
                                <Typography variant="body2">
                                    {t("PasswordWarningPart1")}
                                </Typography>
                                <Typography variant="body2">
                                    {t("PasswordWarningPart2")}
                                </Typography>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={analyticsEnabled !== false}
                                            onChange={this.toggleAnalytics}
                                        />
                                    }
                                    label={t(
                                        "Allow basic and anonymous Google Analytics tracking"
                                    )}
                                />

                                <div style={{ textAlign: "center" }}>
                                    <TranslateButton
                                        variant={"raised"}
                                        color={"primary"}
                                        style={styles.buttons}
                                        onClick={this.ignoreWarning}
                                    >
                                        Get started
                                    </TranslateButton>
                                </div>
                            </CardContent>
                        </Card>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        analyticsEnabled: state.options.analytics_enabled
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setAnalyticsEnabled: enabled => dispatch(setAnalyticsEnabled(enabled))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Disclaimer)
);

import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Redirect from "react-router-dom/Redirect";
import Helmet from "react-helmet";
import store from "store";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import LockIcon from "@material-ui/icons/Lock";
import DesktopIcon from "@material-ui/icons/DesktopMac";
import BuildIcon from "@material-ui/icons/Edit";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";

import TranslateButton from "../Components/TranslationHelpers/Button";

import Analytics from "../Functions/Analytics";
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
            hasReadWarning: !!store.get("HAS_READ_DEV_WARNING2"),

            clicked: false
        };
    }

    ignoreWarning = event => {
        store.set("HAS_READ_DEV_WARNING2", true);
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

        if (clicked === true && hasReadWarning === true && typeof analyticsEnabled !== "undefined") {
            return <Redirect to="/login" />;
        }

        return (
            <Grid container spacing={16} justify={"center"} alignItems={"center"} style={styles.wrapperContainer}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Disclaimer")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Card style={styles.warningCard}>
                        <CardContent>
                            <Typography variant="h5">
                                <DesktopIcon /> bunqDesktop
                            </Typography>
                            <Typography variant="body2">{t("DisclaimerBunqDesktopExplanation")}</Typography>
                            <br />

                            <Typography variant="h5">
                                <BuildIcon /> Development
                            </Typography>
                            <Typography variant="body2">{t("DisclaimerActiveDevelopmentWarning")}</Typography>
                            <br />

                            <Typography variant="h5">
                                <LockIcon /> Password
                            </Typography>
                            <Typography variant="body2">{t("DisclaimerPasswordWarningPart1")}</Typography>
                            <Typography variant="body2">{t("DisclaimerPasswordWarningPart2")}</Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox checked={analyticsEnabled !== false} onChange={this.toggleAnalytics} />
                                }
                                label={t("Allow basic and anonymous Google Analytics tracking")}
                            />

                            <div style={{ textAlign: "center" }}>
                                <TranslateButton
                                    variant="contained"
                                    color="primary"
                                    style={styles.buttons}
                                    onClick={this.ignoreWarning}
                                >
                                    Get started
                                </TranslateButton>
                            </div>
                        </CardContent>
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

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Disclaimer));

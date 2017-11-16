import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import CopyToClipboard from "react-copy-to-clipboard";
import List, { ListItem, ListItemText } from "material-ui/List";

const { app } = require("electron").remote;

import NavLink from "../Components/Routing/NavLink";
import { allReleases } from "../Helpers/VersionChecker";
import { humanReadableDate } from "../Helpers/Utils";
import Logger from "../Helpers/Logger";
import { openSnackbar } from "../Actions/snackbar";

const styles = {
    avatar: {
        width: 55,
        height: 55
    },
    paper: {
        padding: 24
    }
};

class ApplicationInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            releases: [],
            loading: false
        };
    }

    componentDidMount() {
        this.updateReleaseList();
    }

    updateReleaseList = () => {
        this.setState({ loading: true });
        allReleases()
            .then(releases => {
                this.setState({
                    releases: releases,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({ loading: false });
                Logger.error(error);
            });
    };

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    render() {
        const releaseItems = this.state.releases.slice(0, 10).map(release => {
            const preRelease = release.prerelease ? " (Pre-Release)" : "";
            return (
                <ListItem
                    button
                    component="a"
                    className="js-external-link"
                    rel="noopener"
                    href={release.html_url}
                >
                    <ListItemText
                        primary={`v${release.tag_name} ${preRelease}`}
                        secondary={`Released: ${humanReadableDate(
                            release.published_at
                        )}`}
                    />
                </ListItem>
            );
        });

        return (
            <Grid container spacing={24} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Application Information`}</title>
                </Helmet>

                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={24} justify={"center"}>
                            <Grid item sm={3} md={2}>
                                <a
                                    className="js-external-link"
                                    rel="noopener"
                                    href="https://github.com/BunqCommunity/BunqDesktop"
                                >
                                    <Avatar
                                        style={styles.avatar}
                                        src="./images/bunq-logo-textless-2.png"
                                    />
                                </a>
                            </Grid>

                            <Grid item sm={9} md={10}>
                                <Typography type={"headline"}>
                                    BunqDesktop
                                </Typography>
                                <Typography type={"body2"}>
                                    Version: {process.env.CURRENT_VERSION}
                                </Typography>
                            </Grid>

                            <Grid item sm={12}>
                                <CopyToClipboard
                                    text={`${app.getPath(
                                        "userData"
                                    )}/BunqDesktop.log.txt`}
                                    onCopy={this.copiedValue(
                                        "settings location"
                                    )}
                                >
                                    <Typography type={"body2"}>
                                        Settings: {app.getPath("userData")}/settings.json
                                    </Typography>
                                </CopyToClipboard>

                                <CopyToClipboard
                                    text={`${app.getPath(
                                        "userData"
                                    )}/BunqDesktop.log.txt`}
                                    onCopy={this.copiedValue("log location")}
                                >
                                    <Typography type={"body2"}>
                                        Log file: {app.getPath("userData")}/BunqDesktop.log.txt
                                    </Typography>
                                </CopyToClipboard>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography type={"title"}>Releases</Typography>
                                <List>{releaseItems}</List>
                            </Grid>
                            <Grid item xs={12}>
                                <Button raised component={NavLink} to={"/"}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationInfo);

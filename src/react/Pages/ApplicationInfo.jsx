import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";

import FolderIcon from "material-ui-icons/Folder";

const remote = require("electron").remote;
const shell = require("electron").shell;
const app = remote.app;

import NavLink from "../Components/Routing/NavLink";
import { allReleases } from "../Helpers/VersionChecker";
import { humanReadableDate } from "../Helpers/Utils";
import Logger from "../Helpers/Logger";

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
                            <Grid item xs={2} md={1}>
                                <a
                                    className="js-external-link"
                                    rel="noopener"
                                    href="https://github.com/BunqCommunity/BunqDesktop"
                                >
                                    <Avatar
                                        style={styles.avatar}
                                        src="./images/512x512.png"
                                    />
                                </a>
                            </Grid>

                            <Grid item xs={8} md={10}>
                                <Typography variant={"headline"}>
                                    BunqDesktop
                                </Typography>
                                <Typography variant={"body2"}>
                                    Version: {process.env.CURRENT_VERSION}
                                </Typography>
                            </Grid>

                            <Grid item xs={2} md={1}>
                                <IconButton
                                    onClick={() =>
                                        shell.openItem(app.getPath("userData"))}
                                >
                                    <FolderIcon />
                                </IconButton>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant={"body2"}>
                                    Application data: {app.getPath("userData")}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="raised"
                                    component={NavLink}
                                    to={"/"}
                                >
                                    Back
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant={"title"}>
                                    Releases
                                </Typography>
                                <List>{releaseItems}</List>
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

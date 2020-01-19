import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import UrlIcon from "@material-ui/icons/Link";

import LinkPreviewField from "./LinkPreviewField";
import QRCode from "../../Components/QR/QRCode";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";

const styles = {
    headerTypography: {
        wordBreak: "break-word"
    },
    paper: {
        width: "100%",
        textAlign: "left",
        padding: 8,
        marginBottom: 20
    },
    qrCodeContainer: {
        padding: 8,
        margin: 12,
        height: 220,
        width: 220,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff"
    },
    gridContainer: {
        height: "100%",
        flexDirection: "column"
    },
    qrGridItem: {
        height: "150px"
    },
    urlContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "middle"
    },
    linkTexts: {
        marginTop: 2
    },
    amountField: {
        width: 80,
        fontSize: "1rem",
        margin: "0px 2px"
    },
    linkField: {
        width: "100%",
        margin: "0px 2px"
    }
};

class BunqMePersonal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedLink: "",
            bunqMeLinks: [],
            checked: false,

            linkAmount: "",
            linkDescription: ""
        };
    }

    componentDidMount() {
        const bunqMeLinks = [];
        this.props.accounts.forEach(account => {
            account.alias.forEach(alias => {
                if (alias.type === "URL") {
                    bunqMeLinks.push(alias.value);
                }
            });
        });

        if (bunqMeLinks.length > 0) {
            this.setState({
                bunqMeLinks: bunqMeLinks,
                selectedLink: bunqMeLinks[0],
                checked: true
            });
        } else {
            this.setState({
                bunqMeLinks: bunqMeLinks,
                checked: true
            });
        }
    }

    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
    };

    selectLink = bunqMeLink => e => {
        this.setState({
            selectedLink: bunqMeLink
        });
    };

    reset = () => {
        this.setState({
            linkAmount: "",
            linkDescription: ""
        });
    };

    downloadQrImage = () => {
        const link = document.getElementById("hidden-link");
        const canvas = document.querySelector(".qr-code-wrapper > canvas");
        link.setAttribute("download", "bunqme-link-qr.png");
        link.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    };

    render() {
        const { t } = this.props;
        const { checked, selectedLink, bunqMeLinks, linkAmount, linkDescription } = this.state;

        let content = null;
        if (checked) {
            if (selectedLink) {
                let combinedLink = selectedLink;

                if (linkAmount) {
                    const urlEncodedNumber = parseFloat(linkAmount);
                    combinedLink = `${combinedLink}/${urlEncodedNumber}`;
                } else if (!linkDescription) {
                    combinedLink = `${combinedLink}`;
                } else {
                    combinedLink = `${combinedLink}/0`;
                }
                if (linkDescription) {
                    const urlEncodedDescription = encodeURI(linkDescription);
                    combinedLink = `${combinedLink}/${urlEncodedDescription}`;
                }

                content = (
                    <div>
                        <LinkPreviewField value={combinedLink} reset={this.reset} />

                        <div style={styles.qrCodeContainer} className="qr-code-wrapper">
                            <a id="hidden-link" style={{ display: "none" }} />
                            <QRCode value={combinedLink} onClick={this.downloadQrImage} />
                        </div>

                        <Paper style={styles.paper}>
                            <div style={styles.urlContainer}>
                                <Typography variant="subtitle1" style={styles.linkTexts}>
                                    {selectedLink}/
                                </Typography>
                                <MoneyFormatInput
                                    value={linkAmount}
                                    style={styles.amountField}
                                    onValueChange={valueObject => {
                                        this.setState({
                                            linkAmount:
                                                valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
                                        });
                                    }}
                                />
                                <Typography variant="subtitle1" style={styles.linkTexts}>
                                    /
                                </Typography>
                                <TextField
                                    value={linkDescription}
                                    placeholder="Optional description"
                                    onChange={this.onChange("linkDescription")}
                                    style={styles.linkField}
                                />
                            </div>
                        </Paper>

                        <Paper style={styles.paper}>
                            <List>
                                {bunqMeLinks.map(bunqMeLink => {
                                    return (
                                        <ListItem button onClick={this.selectLink(bunqMeLink)}>
                                            <ListItemIcon>
                                                <UrlIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={bunqMeLink} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Paper>
                    </div>
                );
            } else {
                content = (
                    <Paper style={styles.paper}>
                        <Typography variant="subheader">
                            {t("No personal link found, set one in the bunq app to begin!")}
                        </Typography>
                    </Paper>
                );
            }
        }

        return (
            <Grid container spacing={16} justify="center" align="center" style={styles.gridContainer}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("bunqme personal link")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={8} md={6} lg={5} xl={4} style={{ width: "100%" }}>
                    {content}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(BunqMePersonal));

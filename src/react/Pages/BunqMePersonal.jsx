import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import QRCode from "../Components/QR/QRCode";

const styles = {
    paper: {
        marginBottom: 20
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
        margin: "0px 2px"
    },
    linkField: {
        margin: "0px 2px"
    }
};

class BunqMePersonal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            personalLink: "",
            checked: false,

            linkAmount: 3,
            linkDescription: "Test description"
        };
    }

    componentDidMount() {
        let personalLink = false;
        this.props.accounts.forEach(account => {
            account.alias.forEach(alias => {
                if (alias.type === "URL") {
                    personalLink = alias.value;
                }
            });
        });

        if (personalLink) {
            this.setState({
                personalLink: personalLink,
                checked: true
            });
        } else {
            this.setState({
                checked: true
            });
        }
    }

    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
    };

    render() {
        const { t } = this.props;
        const { checked, personalLink, linkAmount, linkDescription } = this.state;

        let content = null;

        if (checked) {
            if (personalLink) {
                let combinedLink = personalLink;

                if (linkAmount) {
                    const urlEncodedNumber = parseFloat(linkAmount);
                    combinedLink = `${combinedLink}/${urlEncodedNumber}`;
                } else {
                    combinedLink = `${combinedLink}/0`;
                }
                if (linkDescription) {
                    const urlEncodedDescription = encodeURI(linkDescription);
                    combinedLink = `${combinedLink}/${urlEncodedDescription}`;
                }

                content = (
                    <div>
                        <Typography variant="h5">{combinedLink}</Typography>

                        <QRCode value={combinedLink} />

                        <div style={styles.urlContainer}>
                            <Typography variant="subtitle1" style={styles.linkTexts}>
                                {personalLink}/
                            </Typography>
                            <TextField
                                type="number"
                                value={linkAmount}
                                onChange={this.onChange("linkAmount")}
                                style={styles.amountField}
                            />
                            <Typography variant="subtitle1" style={styles.linkTexts}>
                                /
                            </Typography>
                            <TextField
                                value={linkDescription}
                                onChange={this.onChange("linkDescription")}
                                style={styles.linkField}
                            />
                        </div>
                    </div>
                );
            } else {
                content = (
                    <Paper style={styles.paper}>
                        <Typography variant="subheader">
                            No personal link found, set one in the bunq app to begin!
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

                <Grid item xs={12} sm={8} lg={6}>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(BunqMePersonal));

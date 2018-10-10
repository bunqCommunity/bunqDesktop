import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import HelpIcon from "@material-ui/icons/Help";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

const styles = {
    title: {
        margin: 16
    },
    container: {
        padding: 8
    },
    button: {
        width: "100%"
    },
    logo: {
        maxWidth: 30,
        maxHeight: 30,
        marginLeft: 10
    },
    titleWrapper: {
        display: "flex",
        alignItems: "center"
    },
    contactCount: {
        marginLeft: 54
    }
};

const ContactHeader = props => {
    const { t, contacts, contactType } = props;

    // fallback to empty list
    if (!contacts[contactType]) {
        contacts[contactType] = [];
    }

    const contactsCount = contacts[contactType] ? contacts[contactType].length : 0;

    return (
        <Grid container alignItems={"center"} spacing={8} style={styles.container}>
            <Grid item xs={12} sm={4} md={6} style={styles.titleWrapper}>
                <img style={styles.logo} src={props.logo} />

                <TranslateTypography variant={"title"} style={styles.title}>
                    {props.title}
                </TranslateTypography>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
                <TranslateButton
                    variant="raised"
                    color="secondary"
                    style={styles.button}
                    disabled={props.loading}
                    onClick={() => props.clear(props.contactType)}
                >
                    Clear
                </TranslateButton>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
                {props.canImport ? (
                    <Button
                        variant="raised"
                        color="primary"
                        style={styles.button}
                        disabled={props.loading}
                        onClick={props.import}
                    >
                        {t(props.importButtonText)}
                    </Button>
                ) : (
                    <Button
                        variant="raised"
                        color="primary"
                        style={styles.button}
                        disabled={props.loading}
                        onClick={props.login}
                    >
                        {t(props.loginButtonText)}
                    </Button>
                )}
            </Grid>

            <Grid item xs={8} sm={10}>
                {contactsCount > 0 ? (
                    <Typography variant={"subheading"} style={styles.contactCount}>
                        {`${contactsCount} ${t("contacts")}`}
                    </Typography>
                ) : (
                    <TranslateTypography variant={"subheading"} style={styles.contactCount}>
                        No stored contacts
                    </TranslateTypography>
                )}
            </Grid>
            <Grid item xs={4} sm={2}>
                {props.questionLink ? (
                    <IconButton component="a" className="js-external-link" rel="noopener" href={props.questionLink}>
                        <HelpIcon />
                    </IconButton>
                ) : null}
            </Grid>
        </Grid>
    );
};

ContactHeader.propTypes = {
    contactType: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    import: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canImport: PropTypes.bool.isRequired,
    logo: PropTypes.string.isRequired,
    contactType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,

    questionLink: PropTypes.string,

    loginButtonText: PropTypes.string,
    importButtonText: PropTypes.string
};

ContactHeader.defaultProps = {
    loginButtonText: "Login",
    importButtonText: "Import"
};

export default translate("translations")(ContactHeader);

import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

const styles = {
    title: {
        margin: 16
    },
    body: {
        margin: 16,
        textAlign: "center"
    },
    button: {
        width: "100%"
    },
    logo: {
        width: 20,
        marginLeft: 16
    }
};

const ContactHeader = props =>{
    const {t} = props;

    return (
        <Grid container alignItems={"center"} spacing={8}>
            <Grid item xs={12} sm={4} md={6}>
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
                    onClick={() =>
                        props.clear(props.contactType)}
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
                        <img style={styles.logo} src={props.logo} />
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
                        <img style={styles.logo} src={props.logo} />
                    </Button>
                )}
            </Grid>
        </Grid>
    );
}

ContactHeader.propTypes = {
    contactType: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    import: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    canImport: PropTypes.bool.isRequired,
    logo: PropTypes.string.isRequired,
    contactType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,

    loginButtonText: PropTypes.string,
    importButtonText: PropTypes.string,
}

ContactHeader.defaultProps = {
    loginButtonText: "Login",
    importButtonText: "Import",
}

export default translate("translations")(ContactHeader);

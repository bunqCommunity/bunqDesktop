import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import { ipcRenderer } from "electron";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import { openSnackbar } from "../../Actions/snackbar";
import {
    contactInfoUpdateGoogle,
    contactInfoUpdateOffice365,
    contactsClear,
    contactsSetInfoType
} from "../../Actions/contacts";

import ContactList from "./ContactList";

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

class Contacts extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            googleAccessToken: false,
            office365AccessToken: false,

            shownContacts: {},

            contacts: {}
        };

        ipcRenderer.on(
            "received-oauth-google-access-token",
            this.handleGoogleCallback
        );
        ipcRenderer.on(
            "received-oauth-office-365-access-token",
            this.handleOffice365Callback
        );
        ipcRenderer.on("received-oauth-failed", this.handleError);
    }

    handleError = event => {
        const failedMessage = this.props.t(
            "Failed to validate the authentication tokens"
        );

        this.props.openSnackbar(failedMessage);
    };

    openGoogleConsentScreen = event => {
        ipcRenderer.send("open-google-oauth");
    };
    handleGoogleCallback = (event, accessToken) => {
        this.setState({
            googleAccessToken: accessToken
        });
    };
    getGoogleContacts = event => {
        this.props.contactInfoUpdateGoogle(this.state.googleAccessToken);
    };

    openOfficeConsentScreen = event => {
        ipcRenderer.send("open-office-365-oauth");
    };
    handleOffice365Callback = (event, accessToken) => {
        this.setState({
            office365AccessToken: accessToken
        });
    };
    getOfficeContacts = event => {
        this.props.contactInfoUpdateOffice365(this.state.office365AccessToken);
    };

    toggleContactType = type => {
        const shownContacts = this.state.shownContacts;
        shownContacts[type] = !shownContacts[type];
        this.setState({ shownContacts: shownContacts });
    };

    removeContact = (sourceType, contactKey, itemKey, itemType) => event => {
        if (
            this.props.contacts[sourceType] &&
            this.props.contacts[sourceType][contactKey]
        ) {
            const contacts = this.props.contacts[sourceType];

            if (itemType === "EMAIL") {
                // remove this email from the list
                contacts[contactKey].emails.splice(itemKey, 1);
            } else if (itemType === "PHONE") {
                // remove this phonenumber from the list
                contacts[contactKey].phoneNumbers.splice(itemKey, 1);
            }

            if (
                contacts[contactKey].emails.length === 0 &&
                contacts[contactKey].phoneNumbers.length === 0
            ) {
                // remove this entire contact since no emails/phonenumbers are left
                contacts.splice(contactKey, 1);
            }

            // set the new contacts
            this.props.contactsSetInfoType(contacts, contactKey);
        }
    };

    render() {
        const { t, contacts } = this.props;

        return (
            <Grid container spacing={16} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Contacts")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={12}>
                    <Grid container justify={"center"} spacing={8}>
                        <Grid item xs={8} md={9} lg={10}>
                            <TranslateTypography variant={"headline"}>
                                Contacts
                            </TranslateTypography>
                        </Grid>

                        <Grid
                            item
                            xs={4}
                            md={3}
                            lg={2}
                            style={{ textAlign: "right" }}
                        >
                            <TranslateButton
                                variant="raised"
                                color="secondary"
                                style={styles.button}
                                disabled={this.props.contactsLoading}
                                onClick={() => this.props.clearContacts()}
                            >
                                Clear all
                            </TranslateButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={10} md={6}>
                    <Paper>
                        <Grid container alignItems={"center"} spacing={8}>
                            <Grid item xs={12} sm={4} md={6} lg={8}>
                                <TranslateTypography
                                    variant={"title"}
                                    style={styles.title}
                                >
                                    Google Contacts
                                </TranslateTypography>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <TranslateButton
                                    variant="raised"
                                    color="secondary"
                                    style={styles.button}
                                    disabled={this.props.contactsLoading}
                                    onClick={() =>
                                        this.props.clearContacts(
                                            "GoogleContacts"
                                        )}
                                >
                                    Clear
                                </TranslateButton>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                {this.state.googleAccessToken ? (
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.getGoogleContacts}
                                    >
                                        {t("Import")}
                                        <img
                                            style={styles.logo}
                                            src={"./images/google-logo.svg"}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.openGoogleConsentScreen}
                                    >
                                        {t("Login")}
                                        <img
                                            style={styles.logo}
                                            src={"./images/google-logo.svg"}
                                        />
                                    </Button>
                                )}
                            </Grid>
                        </Grid>

                        <ContactList
                            contacts={contacts}
                            contactType={"GoogleContacts"}
                            shownContacts={this.state.shownContacts}
                            removeContact={this.removeContact}
                            toggleContactType={this.toggleContactType}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={10} md={6}>
                    <Paper>
                        <Grid container alignItems={"center"} spacing={8}>
                            <Grid item xs={12} sm={4} md={6} lg={8}>
                                <TranslateTypography
                                    variant={"title"}
                                    style={styles.title}
                                >
                                    Office 365 Contacts
                                </TranslateTypography>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <TranslateButton
                                    variant="raised"
                                    color="secondary"
                                    style={styles.button}
                                    disabled={this.props.contactsLoading}
                                    onClick={() =>
                                        this.props.clearContacts("Office365")}
                                >
                                    Clear
                                </TranslateButton>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                {this.state.office365AccessToken ? (
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.getOfficeContacts}
                                    >
                                        {t("Import")}
                                        <img
                                            style={styles.logo}
                                            src={"./images/office-365-logo.svg"}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.openOfficeConsentScreen}
                                    >
                                        {t("Login")}
                                        <img
                                            style={styles.logo}
                                            src={"./images/office-365-logo.svg"}
                                        />
                                    </Button>
                                )}
                            </Grid>
                        </Grid>

                        <ContactList
                            contacts={contacts}
                            contactType={"Office365"}
                            shownContacts={this.state.shownContacts}
                            removeContact={this.removeContact}
                            toggleContactType={this.toggleContactType}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.contacts.contacts,
        contactsLoading: state.contacts.loading,
        contactsLastUpdate: state.contacts.last_update
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        contactInfoUpdateGoogle: accessToken =>
            dispatch(contactInfoUpdateGoogle(BunqJSClient, accessToken)),
        contactInfoUpdateOffice365: accessToken =>
            dispatch(contactInfoUpdateOffice365(BunqJSClient, accessToken)),
        contactsSetInfoType: (contacts, type) =>
            dispatch(contactsSetInfoType(contacts, type, BunqJSClient)),
        clearContacts: (type = false) =>
            dispatch(contactsClear(BunqJSClient, type)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Contacts)
);

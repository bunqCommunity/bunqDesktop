import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import { ipcRenderer } from "electron";
import Logger from "../Helpers/Logger";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import List, {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    ListItemSecondaryAction
} from "material-ui/List";

import PhoneIcon from "@material-ui/icons/Phone";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import DeleteIcon from "@material-ui/icons/Delete";

import TranslateTypography from "../Components/TranslationHelpers/Typography";
import TranslateButton from "../Components/TranslationHelpers/Button";

import { openSnackbar } from "../Actions/snackbar";
import {
    contactInfoUpdateGoogle,
    contactsClear,
    contactsSetInfoType
} from "../Actions/contacts";

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
    google_logo: {
        width: 20,
        marginLeft: 16
    }
};

class Contacts extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            accessToken: false,
            error: false,
            success: false,

            contacts: []
        };

        ipcRenderer.on("received-oauth-access-token", this.handleCallback);
        ipcRenderer.on("received-oauth-failed", this.handleError);
    }

    handleError = event => {
        const failedMessage = this.props.t(
            "Failed to validate the Google authentication tokens"
        );

        this.props.openSnackbar(failedMessage);
    };

    handleCallback = (event, accessToken) => {
        const failedMessage = this.props.t(
            "Failed to validate the Google authentication tokens"
        );

        axios
            .get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
            )
            .then(response => {
                const responseData = response.data;

                this.setState({
                    accessToken: accessToken,
                    success: true
                });
            })
            .catch(error => {
                this.props.openSnackbar(failedMessage);
                if (error.response) {
                    Logger.error(error.response.data);
                }

                this.setState({
                    accessToken: false,
                    error: true
                });
            });
    };

    getContacts = event => {
        this.props.contactInfoUpdateGoogle(this.state.accessToken);
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
            this.props.contactsSetInfoType(contacts, "GoogleContacts");
        }
    };

    openConsentScreen = event => {
        ipcRenderer.send("open-google-oauth");
    };

    render() {
        const { t, contacts } = this.props;

        let googleContactItems = [];
        if (contacts["GoogleContacts"]) {
            googleContactItems = contacts[
                "GoogleContacts"
            ].map((contact, key) => {
                return (
                    <React.Fragment>
                        {contact.name ? (
                            <ListItem key={key}>
                                <ListItemIcon>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary={contact.name} />
                            </ListItem>
                        ) : null}
                        {contact.emails ? (
                            contact.emails.map((email, key2) => {
                                return (
                                    <ListItem key={key2}>
                                        <ListItemIcon>
                                            <Avatar>
                                                <EmailIcon />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText primary={email} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={this.removeContact(
                                                    "GoogleContacts",
                                                    key,
                                                    key2,
                                                    "EMAIL"
                                                )}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                        ) : null}
                        {contact.phoneNumbers ? (
                            contact.phoneNumbers.map((phoneNumber, key2) => {
                                return (
                                    <ListItem key={key2}>
                                        <ListItemIcon>
                                            <Avatar>
                                                <PhoneIcon />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText primary={phoneNumber} />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={this.removeContact(
                                                    "GoogleContacts",
                                                    key,
                                                    key2,
                                                    "PHONE"
                                                )}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                        ) : null}
                        <Divider />
                    </React.Fragment>
                );
            });
        }

        return (
            <Grid container spacing={16} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Contacts")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
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
                                    onClick={this.props.clearContacts}
                                >
                                    Clear contacts
                                </TranslateButton>
                            </Grid>

                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                {this.state.accessToken ? (
                                    <TranslateButton
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.getContacts}
                                    >
                                        Import contacts
                                    </TranslateButton>
                                ) : (
                                    <Button
                                        variant="raised"
                                        color="primary"
                                        style={styles.button}
                                        disabled={this.props.contactsLoading}
                                        onClick={this.openConsentScreen}
                                    >
                                        {t("Login")}
                                        <img
                                            style={styles.google_logo}
                                            src={"./images/google-logo.svg"}
                                        />
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                        {googleContactItems.length > 0 ? (
                            <List dense>
                                <ListSubheader
                                    primary={`${googleContactItems.length} contacts`}
                                />
                                <Divider />
                                {googleContactItems}
                            </List>
                        ) : (
                            <TranslateTypography
                                variant={"subheading"}
                                style={styles.body}
                            >
                                No stored contacts
                            </TranslateTypography>
                        )}
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
        contactsSetInfoType: (contacts, type) =>
            dispatch(contactsSetInfoType(contacts, type, BunqJSClient)),
        clearContacts: () => dispatch(contactsClear(BunqJSClient)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Contacts)
);

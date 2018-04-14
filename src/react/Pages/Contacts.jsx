import React from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import { ipcRenderer } from "electron";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import List, { ListItem, ListItemIcon } from "material-ui/List";

import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";

import axios from "axios";

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
        console.error("whoops");
    };

    handleCallback = (event, accessToken) => {
        console.log(accessToken);

        axios
            .get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
            )
            .then(response => {
                const responseData = response.data;

                console.log("Checked access token validity");
                console.log(responseData);

                this.setState({
                    accessToken: accessToken,
                    success: true
                });
            })
            .catch(error => {
                console.error(error);

                this.setState({
                    accessToken: false,
                    error: true
                });
            });
    };

    getContacts = event => {
        const contactsUrl = `https://www.google.com/m8/feeds/contacts/default/full?alt=json&max-results=10000`;
        axios
            .get(contactsUrl, {
                headers: {
                    "GData-Version": 3.0,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.state.accessToken}`
                }
            })
            .then(response => {
                const responseData = response.data;
                console.log("Received contacts");
                console.log(responseData);

                console.log("===========");

                console.log(responseData.feed.entry);

                const collectedEntries = [];

                responseData.feed.entry.map(entry => {
                    // has email

                    const emails = [];
                    const phoneNumbers = [];
                    let displayName = "";

                    // has emails, loop through them
                    if (entry["gd$email"] && entry["gd$email"].length > 0) {
                        entry["gd$email"].map(email => {
                            emails.push(email.address);
                        });
                    }

                    // has numbers, loop through them
                    if (
                        entry["gd$phoneNumber"] &&
                        entry["gd$phoneNumber"].length > 0
                    ) {
                        entry["gd$phoneNumber"].map(phoneNumber => {
                            phoneNumbers.push(phoneNumber["$t"]);
                        });
                    }

                    // has fullname, add it
                    if (entry["gd$name"] && entry["gd$name"]["gd$fullName"]) {
                        displayName = entry["gd$name"]["gd$fullName"]["$t"];
                    }

                    if (emails.length > 0 || phoneNumbers.length > 0) {
                        collectedEntries.push({
                            name: displayName,
                            emails: emails,
                            phoneNumbers: phoneNumbers
                        });
                    }
                });

                // log all collected data
                console.log(collectedEntries);

                this.setState({ contacts: collectedEntries });
            })
            .catch(error => {
                console.error(error);
            });
    };

    openConsentScreen = event => {
        ipcRenderer.send("open-google-oauth");
    };

    render() {
        const t = this.props.t;

        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Contacts")}`}</title>
                </Helmet>

                <Grid container spacing={16} justify={"center"}>
                    <Grid item xs={12}>
                        <Button onClick={this.openConsentScreen}>
                            Contacts please
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.accessToken ? (
                            <React.Fragment>
                                <TextField
                                    style={{ width: "400px" }}
                                    value={this.state.accessToken}
                                />
                                <br />
                                <Button onClick={this.getContacts}>
                                    Get Contacts
                                </Button>
                            </React.Fragment>
                        ) : null}
                    </Grid>
                    <Grid item xs={12}>
                        <List>
                            <Divider />
                            {this.state.contacts.map((contact, key) => {
                                return (
                                    <React.Fragment>
                                        <ListItem key={key}>
                                            {contact.name}
                                        </ListItem>
                                        {contact.emails.map((email, key2) => {
                                            return (
                                                <ListItem key={key2}>
                                                    <ListItemIcon>
                                                        <Avatar>
                                                            <EmailIcon />
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    {email}
                                                </ListItem>
                                            );
                                        })}
                                        {contact.phoneNumbers.map(
                                            (phoneNumber, key2) => {
                                                return (
                                                    <ListItem key={key2}>
                                                        <ListItemIcon>
                                                            <Avatar>
                                                                <PhoneIcon />
                                                            </Avatar>
                                                        </ListItemIcon>
                                                        {phoneNumber}
                                                    </ListItem>
                                                );
                                            }
                                        )}
                                        <Divider />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default translate("translations")(Contacts);

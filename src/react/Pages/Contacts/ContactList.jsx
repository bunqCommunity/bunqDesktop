import React from "react";
import Grid from "material-ui/Grid";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import List, {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import PhoneIcon from "@material-ui/icons/Phone";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import DeleteIcon from "@material-ui/icons/Delete";

export default props => {
    const { contacts, contactType, toggleContactType, shownContacts } = props;
    const t = window.t;

    // fallback to empty list
    if (!contacts[contactType]) {
        contacts[contactType] = [];
    }

    let contactList = [];
    if (contacts[contactType] && contacts[contactType].length > 0) {
        contactList = contacts[contactType].map((contact, key) => {
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
                                            onClick={props.removeContact(
                                                contactType,
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
                                            onClick={props.removeContact(
                                                contactType,
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

    const isShown = !!shownContacts[contactType];

    return contactList.length > 0 ? (
        <React.Fragment>
            <Grid container spacing={8}>
                <Grid item xs={12} sm={6} style={{ padding: 12 }}>
                    <Typography variant={"subheading"}>
                        {`${contactList.length} ${t("contacts")}`}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                    <Button onClick={event => toggleContactType(contactType)}>
                        {isShown ? t(`Hide contacts`) : t(`Show contacts`)}
                    </Button>
                </Grid>
            </Grid>

            <List dense>
                <Collapse in={isShown}>{contactList}</Collapse>
            </List>
        </React.Fragment>
    ) : (
        <TranslateTypography
            variant={"subheading"}
            style={{ textAlign: "center", padding: 16 }}
        >
            No stored contacts
        </TranslateTypography>
    );
};

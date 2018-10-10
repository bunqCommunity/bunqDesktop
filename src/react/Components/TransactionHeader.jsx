import React from "react";
import withTheme from "@material-ui/core/styles/withTheme";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

import LazyAttachmentImage from "./AttachmentImage/LazyAttachmentImage";

import {
    defaultMastercardImage,
    defaultRequestResponseImage,
    defaultPaymentImage
} from "../Helpers/DefaultImageHandlers";

const styles = {
    targetWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    },
    arrow: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 90,
        height: 90,
        marginBottom: 8
    }
};

const TransactionHeader = props => {
    const fromAlias = props.from;
    const toAlias = props.to;

    const fromAvatar = fromAlias.avatar !== null ? fromAlias.avatar.image[0].attachment_public_uuid : false;
    const toAvatar = toAlias.avatar !== null ? toAlias.avatar.image[0].attachment_public_uuid : false;

    // swap the orientation based on prop
    const swap = props.swap !== undefined && props.swap !== false;

    // color the arrows
    const arrowColor = props.theme.palette.text.primary;

    let toIsCounterparty = false;
    let fromIsCounterparty = false;
    let toLabelName = toAlias.display_name;
    const secondaryToLabelName =
        toAlias.display_name === toAlias.label_user.display_name ? false : toAlias.label_user.display_name;

    let fromLabelName = fromAlias.display_name;
    const secondaryFromLabelName =
        fromAlias.display_name === fromAlias.label_user.display_name ? false : fromAlias.label_user.display_name;

    // accounts list is available
    if (props.accounts) {
        // loop through accounts
        props.accounts.forEach(account => {
            const accountInfo = account;

            // loop through alias to find the iban and check if it matches
            accountInfo.alias.forEach(alias => {
                // if IBAN check if it matches the from or to alias
                if (alias.type === "IBAN") {
                    if (alias.value === fromAlias.iban) {
                        fromLabelName = accountInfo.description;
                        // the "from" side is this user so we show a "to" button
                        toIsCounterparty = true;
                    }
                    if (alias.value === toAlias.iban) {
                        toLabelName = accountInfo.description;
                        // the "to" side is this user so we show a "from" button
                        fromIsCounterparty = true;
                    }
                }
            });
        });
    }

    // if both are true, than both from and to targets are within personl account
    if (toIsCounterparty && fromIsCounterparty) {
        toIsCounterparty = false;
        fromIsCounterparty = false;
    }

    let defaultImage = false;
    if (props.type && props.type) {
        if (props.type === "payment") {
            defaultImage = defaultPaymentImage(props.event);
        }
        if (props.type === "masterCardAction") {
            defaultImage = defaultMastercardImage(props.event);
        }
        if (props.type === "requestResponse") {
            defaultImage = defaultRequestResponseImage(props.event);
        }
    }

    const components = [
        <Grid item xs={12} md={5} style={styles.targetWrapper}>
            <Avatar style={styles.avatar}>
                <LazyAttachmentImage
                    height={90}
                    defaultImage={defaultImage}
                    BunqJSClient={props.BunqJSClient}
                    imageUUID={fromAvatar}
                    onClick={() => {
                        if (fromIsCounterparty && props.startPaymentIban) {
                            props.startPaymentIban(fromAlias);
                        }
                    }}
                    style={{
                        cursor: fromIsCounterparty ? "pointer" : "default"
                    }}
                />
            </Avatar>
            <Typography variant="subheading">{fromLabelName}</Typography>
            {secondaryFromLabelName && <Typography variant="subheading">{secondaryFromLabelName}</Typography>}
        </Grid>,

        <Hidden smDown>
            <Grid item md={2} style={styles.arrow}>
                <ArrowForwardIcon style={{ color: arrowColor }} color={"inherit"} />
            </Grid>
        </Hidden>,

        <Hidden mdUp>
            <Grid item xs={12} style={styles.arrow}>
                <ArrowDownIcon style={{ color: arrowColor }} color={"inherit"} />
            </Grid>
        </Hidden>,

        <Grid item xs={12} md={5} style={styles.targetWrapper}>
            <Avatar style={styles.avatar}>
                <LazyAttachmentImage
                    height={90}
                    defaultImage={defaultImage}
                    BunqJSClient={props.BunqJSClient}
                    imageUUID={toAvatar}
                    onClick={() => {
                        if (toIsCounterparty && props.startPaymentIban) {
                            props.startPaymentIban(toAlias);
                        }
                    }}
                    style={{
                        cursor: toIsCounterparty ? "pointer" : "default"
                    }}
                />
            </Avatar>

            <Typography variant="subheading">{toLabelName}</Typography>
            {secondaryToLabelName && <Typography variant="subheading">{secondaryToLabelName}</Typography>}
        </Grid>
    ];

    if (swap) components.reverse();

    return components;
};

export default withTheme()(TransactionHeader);

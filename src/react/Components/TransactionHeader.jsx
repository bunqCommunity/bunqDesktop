import React from "react";
import withTheme from "material-ui/styles/withTheme";
import Grid from "material-ui/Grid";
import ArrowForwardIcon from "material-ui-icons/ArrowForward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";
import Typography from "material-ui/Typography";

import LazyAttachmentImage from "./AttachmentImage/LazyAttachmentImage";

const styles = {
    textCenter: {
        textAlign: "center"
    },
    arrow: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

const TransactionHeader = props => {
    const fromAlias = props.from;
    const toAlias = props.to;

    const fromAvatar =
        fromAlias.avatar !== null
            ? fromAlias.avatar.image[0].attachment_public_uuid
            : false;
    const toAvatar =
        toAlias.avatar !== null
            ? toAlias.avatar.image[0].attachment_public_uuid
            : false;

    // swap the orientation based on prop
    const swap = props.swap !== undefined && props.swap !== false;

    // color the arrows
    const arrowColor = props.theme.palette.text.primary;

    let toLabelName = toAlias.label_user.public_nick_name;
    let fromLabelName = fromAlias.label_user.public_nick_name;

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
                    }
                    if (alias.value === toAlias.iban) {
                        toLabelName = accountInfo.description;
                    }
                }
            });
        });
    }

    const components = [
        <Grid item xs={12} md={5} style={styles.textCenter}>
            <LazyAttachmentImage
                width={90}
                BunqJSClient={props.BunqJSClient}
                imageUUID={fromAvatar}
            />
            <Typography variant="subheading">{fromLabelName}</Typography>
        </Grid>,

        <Grid item md={2} hidden={{ smDown: true }} style={styles.arrow}>
            <ArrowForwardIcon style={{ color: arrowColor }} color={"inherit"} />
        </Grid>,

        <Grid item xs={12} hidden={{ mdUp: true }} style={styles.arrow}>
            <ArrowDownIcon style={{ color: arrowColor }} color={"inherit"} />
        </Grid>,

        <Grid item xs={12} md={5} style={styles.textCenter}>
            <LazyAttachmentImage
                width={90}
                BunqJSClient={props.BunqJSClient}
                imageUUID={toAvatar}
            />

            <Typography variant="subheading">{toLabelName}</Typography>
        </Grid>
    ];

    if (swap) components.reverse();

    return components;
};

export default withTheme()(TransactionHeader);

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

    const components = [
        <Grid item xs={12} md={5} style={styles.textCenter}>
            <LazyAttachmentImage
                width={90}
                BunqJSClient={props.BunqJSClient}
                imageUUID={fromAvatar}
            />
            <Typography type="subheading">{fromAlias.display_name}</Typography>
        </Grid>,

        <Grid item md={2} hidden={{ smDown: true }} style={styles.arrow}>
            <ArrowForwardIcon color={arrowColor} />
        </Grid>,

        <Grid item xs={12} hidden={{ mdUp: true }} style={styles.arrow}>
            <ArrowDownIcon color={arrowColor} />
        </Grid>,

        <Grid item xs={12} md={5} style={styles.textCenter}>
            <LazyAttachmentImage
                width={90}
                BunqJSClient={props.BunqJSClient}
                imageUUID={toAvatar}
            />

            <Typography type="subheading">{toAlias.display_name}</Typography>
        </Grid>
    ];

    if (swap) components.reverse();

    return components;
};

export default withTheme()(TransactionHeader);

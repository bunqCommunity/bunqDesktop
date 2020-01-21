import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

const ShowOnly = (props: any = { secondaryActions: null }) => {
    return (
        <ListItem>
            <Avatar style={styles.smallAvatar}>
                <RemoveRedEyeIcon style={{ color: "#fbc02d" }} />
            </Avatar>

            <ListItemText primary={props.t("Show only")} secondary={props.t("Others can view new transactions")} />

            <ListItemSecondaryAction>{props.secondaryActions}</ListItemSecondaryAction>
        </ListItem>
    );
};

export default ShowOnly;

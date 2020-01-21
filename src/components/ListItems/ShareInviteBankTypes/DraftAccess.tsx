import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

import GroupIcon from "@material-ui/icons/Group";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

const DraftAccess = (props: any = { secondaryActions: null }) => {
    return (
        <ListItem>
            <Avatar style={styles.smallAvatar}>
                <GroupIcon style={{ color: "#03a9f4" }} />
            </Avatar>

            <ListItemText primary={props.t("Draft only")} secondary={props.t("Others can prepare payments")} />

            <ListItemSecondaryAction>{props.secondaryActions}</ListItemSecondaryAction>
        </ListItem>
    );
};

export default DraftAccess;

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";

import VpnKeyIcon from "@material-ui/icons/VpnKey";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

const FullAccess = (props: any = { secondaryActions: null }) => {
    return (
        <ListItem>
            <Avatar style={styles.smallAvatar}>
                <VpnKeyIcon style={{ color: "#1fcd65" }} />
            </Avatar>

            <ListItemText
                primary={props.t("Full access")}
                secondary={props.t("Others can make and view new transactions")}
            />

            <ListItemSecondaryAction>{props.secondaryActions}</ListItemSecondaryAction>
        </ListItem>
    );
};

export default FullAccess;

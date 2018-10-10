import React from "react";
import PropTypes from "prop-types";
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

const DraftAccess = props => {
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

DraftAccess.defaultProps = {
    secondaryActions: null
};

DraftAccess.requiredProps = {
    t: PropTypes.any.isRequired
};

export default DraftAccess;

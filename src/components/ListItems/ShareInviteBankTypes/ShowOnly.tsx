import React from "react";
import PropTypes from "prop-types";
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

const ShowOnly = props => {
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

ShowOnly.defaultProps = {
    secondaryActions: null
};

ShowOnly.requiredProps = {
    t: PropTypes.any.isRequired
};

export default ShowOnly;

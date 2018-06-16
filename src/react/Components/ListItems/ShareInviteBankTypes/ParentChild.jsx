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

const ParentChild = props => {
    return (
        <ListItem>
            <Avatar style={styles.smallAvatar}>
                <GroupIcon style={{color: "#03a9f4"}} />
            </Avatar>

            <ListItemText
                primary={props.t("Parent / Child")}
                secondary={props.t("Others can make and view new transactions")}
            />

            <ListItemSecondaryAction>
                {props.secondaryActions}
            </ListItemSecondaryAction>
        </ListItem>
    );
};

ParentChild.defaultProps = {
    secondaryActions: null
};

ParentChild.requiredProps = {
    t: PropTypes.any.isRequired
};

export default ParentChild;

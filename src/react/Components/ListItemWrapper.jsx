import React from "react";
import { matchPath } from "react-router";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import {
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction
} from "material-ui/List";
import ArrowRightIcon from "material-ui-icons/KeyboardArrowRight";

import NavLink from "./Routing/NavLink";

const styles = {
    listBottomItem: {
        flex: 0
    }
};

export default ({
    icon: PropIcon,
    to: targetUrl,
    text,
    exact = false,
    ...rest
}) => {
    // check if this item is considered active
    const isActive =
        null !==
        matchPath(rest.location.pathname, {
            path: targetUrl,
            exact: exact
        });
    if (isActive === false) {
        // enable the button for this item
        rest.button = true;
        rest.to = targetUrl;
        rest.component = NavLink;
    }

    return (
        <ListItem style={styles.listBottomItem} {...rest}>
            <ListItemIcon>
                <PropIcon />
            </ListItemIcon>
            {isActive ? (
                <ListItemSecondaryAction>
                    <IconButton>
                        <ArrowRightIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            ) : null}
            <Typography type="subheading">{text}</Typography>
        </ListItem>
    );
};

import React from "react";
import { matchPath } from "react-router";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import TranslateTypography from "./TranslationHelpers/Typography";
import NavLink from "./Routing/NavLink";

const styles = {
    listBottomItem: {
        flex: 0
    },
    propIcon: {
        marginRight: 16,
        flexShrink: 0,
        height: 24,
        width: 24
    }
};

export default ({ icon: PropIcon, to: targetUrl, text, exact = false, ...rest }) => {
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

    const iconColor = isActive ? "primary" : "action";

    return (
        <ListItem style={styles.listBottomItem} {...rest}>
            <PropIcon color={iconColor} style={styles.propIcon} />
            <TranslateTypography variant="subheading">{text}</TranslateTypography>
        </ListItem>
    );
};

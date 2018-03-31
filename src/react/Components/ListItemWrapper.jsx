import React from "react";
import { matchPath } from "react-router";
import { ListItem, ListItemIcon } from "material-ui/List";

import TranslateTypography from "./TranslationHelpers/Typography";
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
                <PropIcon color={isActive ? "primary" : "inherit"} />
            </ListItemIcon>
            <TranslateTypography variant="subheading">
                {text}
            </TranslateTypography>
        </ListItem>
    );
};

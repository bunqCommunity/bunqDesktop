import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Divider from "material-ui/Divider";

import NavLink from "../../Components/Routing/NavLink";

class RuleCollectionItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    render() {

        return [
            <ListItem
                button
                component={NavLink}
                to={`/rule-page/a`}
            >
                <ListItemText primary={"a"} secondary={"b"} />
                <ListItemSecondaryAction >
                    other text
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default RuleCollectionItem;

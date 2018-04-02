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
        this.state = {};
    }

    render() {
        const { rule, t } = this.props;
        return [
            <ListItem button component={NavLink} to={`/rule-page/${rule.id}`}>
                <ListItemText
                    primary={rule.getTitle()}
                    secondary={`${rule.getRules().length} ${t("rules")}`}
                />
            </ListItem>,
            <Divider />
        ];
    }
}

export default RuleCollectionItem;

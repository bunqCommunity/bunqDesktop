import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Divider from "material-ui/Divider";
import Icon from "material-ui/Icon";

import NavLink from "../../Components/Routing/NavLink";

class RuleCollectionItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { ruleCollection, categories, t } = this.props;
        const categoryIds = ruleCollection.getCategories();

        // create a list of icons
        const categoryIcons = categoryIds.map(categoryId => {
            const categoryInfo = categories[categoryId];
            if (!categoryInfo) return null;

            return (
                <Icon style={{ color: categoryInfo.color }}>
                    {categoryInfo.icon}
                </Icon>
            );
        });

        return [
            <ListItem
                button
                component={NavLink}
                to={`/rule-page/${ruleCollection.id}`}
            >
                <ListItemText
                    primary={ruleCollection.getTitle()}
                    secondary={`${ruleCollection.getRules().length} ${t(
                        "rules"
                    )}`}
                />
                <ListItemSecondaryAction>
                    {categoryIcons}
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default RuleCollectionItem;

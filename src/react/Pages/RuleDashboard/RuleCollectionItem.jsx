import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";

import NavLink from "../../Components/Routing/NavLink";
import CategoryIcon from "../../Components/Categories/CategoryIcon";

class RuleCollectionItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { ruleCollection, categories, t } = this.props;
        if (!ruleCollection) return null;

        const categoryIds = ruleCollection.getCategories();

        // create a list of icons
        const categoryIcons = categoryIds.map(categoryId => {
            const categoryInfo = categories[categoryId];
            if (!categoryInfo) return null;

            return <CategoryIcon category={categoryInfo} />;
        });

        const enabledText = ruleCollection.isEnabled() ? "Enabled" : "Disabled";
        const secondaryText = `${t(enabledText)} - ${ruleCollection.getRules().length} ${t("rules")}`;

        return [
            <ListItem button component={NavLink} to={`/rule-page/${ruleCollection.id}`}>
                <ListItemText primary={ruleCollection.getTitle()} secondary={secondaryText} />
                <ListItemSecondaryAction>{categoryIcons}</ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default RuleCollectionItem;

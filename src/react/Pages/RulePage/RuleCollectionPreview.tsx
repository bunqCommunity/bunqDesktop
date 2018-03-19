import * as React from "react";
import IconButton from "material-ui/IconButton";
import Divider from "material-ui/Divider";
import Menu, { MenuItem } from "material-ui/Menu";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";

class RuleCollectionPreview extends React.Component<any, any> {
    state = {
        anchorEl: null
    };

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemText
                        primary={"primary text"}
                        secondary={"secondary text"}
                    />
                </ListItem>
            </List>
        );
    }
}

export default RuleCollectionPreview;

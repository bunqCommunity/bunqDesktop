import React from "react";
import { connect } from "react-redux";
import OriginalListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import AddBoxIcon from "@material-ui/icons/AddBox";

import NavLink from "~components/Routing/NavLink";
import { translate } from "react-i18next";

const ListItem: any = OriginalListItem;

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class AddAccount extends React.Component<IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <ListItem button to={`/new-account`} component={NavLink}>
                <Avatar style={styles.bigAvatar}>
                    <AddBoxIcon />
                </Avatar>
                <ListItemText secondary={this.props.t("Open a new bank account")} />
            </ListItem>
        );
    }
}

export default connect()(translate("translations")(AddAccount));

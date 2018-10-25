import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import AddBoxIcon from "@material-ui/icons/AddBox";

import NavLink from "../../Components/Routing/NavLink";
import { translate } from "react-i18next";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    }
};

class AddAccount extends React.Component {
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

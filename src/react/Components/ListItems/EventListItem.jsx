import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import NavLink from "../Routing/NavLink";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";

const styles = {
    listItemText: {
        marginRight: 40
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    buttons: {
        marginRight: 8
    }
};

class EventListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    render() {
        const { t, event } = this.props;

        console.log(event);

        return [
            <ListItem button to={`/event/${event.id}`} component={NavLink}>
                {/*<Avatar style={styles.smallAvatar}>*/}
                {/*<LazyAttachmentImage height={50} BunqJSClient={this.props.BunqJSClient} imageUUID={imageUUID} />*/}
                {/*</Avatar>*/}
                <ListItemText
                    style={styles.listItemText}
                    primary={"displayname"}
                    secondary={event.type}
                />
                <ListItemSecondaryAction />
            </ListItem>,
            <Divider />
        ];
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(EventListItem));

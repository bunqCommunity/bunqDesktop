import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";

import NavLink from "../Routing/NavLink";
import BunqDesktopImage from "../AttachmentImage/BunqDesktopImage";
import MoneyAmountLabel from "../MoneyAmountLabel";
import CategoryIcons from "../Categories/CategoryIcons";

import { eventGenericPrimaryText, eventGenericText } from "../../Functions/EventStatusTexts";
import { formatMoney } from "../../Functions/Utils";

const styles = {
    listItemText: {
        marginRight: 40
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 8,
        textAlign: "right"
    },
    listItemSecondary: {
        marginTop: -8
    },
    buttons: {
        marginRight: 8
    },
    categoryIcons: {
        marginTop: 12
    }
};

const classStyles = theme => ({
    badge: {
        top: 4,
        right: 4,
        border: `2px solid ${theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[900]}`
    }
});
class EventListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    render() {
        const { t, event, accounts } = this.props;

        const eventPrimaryLabel = eventGenericPrimaryText(event, t, accounts);
        const eventLabel = eventGenericText(event, t);

        let paymentLabel = null;
        if (event.isTransaction) {
            const formattedPaymentAmount = formatMoney(event.getAmount());
            paymentLabel = (
                <MoneyAmountLabel style={styles.moneyAmountLabel} info={event} type="event">
                    {formattedPaymentAmount}
                </MoneyAmountLabel>
            );
        }

        let eventAvatar = null;
        if (event.image) {
            eventAvatar = (
                <Avatar style={styles.smallAvatar}>
                    <BunqDesktopImage
                        config={event.image}
                        lazy={true}
                        height={50}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                </Avatar>
            );
        }

        let displayImage = eventAvatar;
        if (event.eventCount && event.eventCount > 1)
            displayImage = (
                <Badge badgeContent={event.eventCount} color="primary" classes={{ badge: this.props.classes.badge }}>
                    {eventAvatar}
                </Badge>
            );

        return [
            <ListItem button to={`/event/${event.id}`} component={NavLink}>
                {displayImage}
                <ListItemText style={styles.listItemText} primary={eventPrimaryLabel} secondary={eventLabel} />
                <ListItemSecondaryAction style={styles.listItemSecondary}>
                    {paymentLabel}
                    <CategoryIcons style={styles.categoryIcons} type={event.type} id={event.id} />
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {};
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(withStyles(classStyles)(EventListItem)));

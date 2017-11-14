import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import CopyIcon from "material-ui-icons/ContentCopy";
import CheckCircle from "material-ui-icons/CheckCircle";
import TimerOff from "material-ui-icons/TimerOff";
import Cancel from "material-ui-icons/Cancel";

import { humanReadableDate, formatMoney } from "../../Helpers/Utils";

const styles = {
    actionListItem: {
        padding: 16
    }
};

class BunqMeTabListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            extraInfoOpen: false
        };
    }

    toggleExtraInfo = () => {
        this.setState({ extraInfoOpen: !this.state.extraInfoOpen });
    };

    cancelTab = () => {
        const { bunqMeTab, user } = this.props;
        this.props.bunqMeTabPut(
            user.id,
            bunqMeTab.monetary_account_id,
            bunqMeTab.id
        );
    };

    render() {
        const { bunqMeTab } = this.props;

        let mainIcon = null;
        let canBeCanceled = false;
        switch (bunqMeTab.status) {
            case "WAITING_FOR_PAYMENT":
                canBeCanceled = true;
                mainIcon = <CheckCircle color={"#8dc55f"} />;
                break;
            case "CANCELLED":
                mainIcon = <Cancel color={"#3f56d6"} />;
                break;
            case "EXPIRED":
                mainIcon = <TimerOff color={"#f50057"} />;
                break;
        }
        const shareUrl = bunqMeTab.bunqme_tab_share_url;
        const createdDate = humanReadableDate(bunqMeTab.created);
        const updatedDate = humanReadableDate(bunqMeTab.updated);
        const expiryDate = humanReadableDate(bunqMeTab.time_expiry);

        const primaryText = `${formatMoney(
            bunqMeTab.bunqme_tab_entry.amount_inquired.value
        )} ${bunqMeTab.bunqme_tab_entry.amount_inquired.currency}`;

        const merchantList = bunqMeTab.bunqme_tab_entry.merchant_available
            .filter(merchant => merchant.available)
            .map(merchant => merchant.merchant_type)
            .join(", ");

        return [
            <ListItem button onClick={this.toggleExtraInfo}>
                {mainIcon}
                <ListItemText
                    primary={primaryText}
                    secondary={bunqMeTab.bunqme_tab_entry.description}
                />
                <ListItemSecondaryAction>
                    <CopyToClipboard
                        text={shareUrl}
                        onCopy={this.props.copiedValue("the bunq.me tab url")}
                    >
                        <IconButton aria-label="Copy the share url">
                            <CopyIcon />
                        </IconButton>
                    </CopyToClipboard>
                </ListItemSecondaryAction>
            </ListItem>,
            <Collapse
                in={this.state.extraInfoOpen}
                transitionDuration="auto"
                unmountOnExit
            >
                <ListItem dense>
                    <ListItemText primary={`Created`} secondary={createdDate} />
                </ListItem>

                {updatedDate !== createdDate ? (
                    <ListItem dense>
                        <ListItemText
                            primary={`Updated`}
                            secondary={updatedDate}
                        />
                    </ListItem>
                ) : null}

                <ListItem dense>
                    <ListItemText primary={`Expires`} secondary={expiryDate} />
                </ListItem>

                <ListItem dense>
                    <ListItemText
                        primary="Available merchants"
                        secondary={merchantList}
                    />
                </ListItem>

                <ListItem style={styles.actionListItem}>
                    <ListItemSecondaryAction>
                        {canBeCanceled ? (
                            <Button
                                raised
                                color="accent"
                                onClick={this.cancelTab}
                            >
                                Cancel request
                            </Button>
                        ) : null}
                    </ListItemSecondaryAction>
                </ListItem>
            </Collapse>,
            <Divider />
        ];
    }
}

export default BunqMeTabListItem;

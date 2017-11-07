import React from "react";
import { connect } from "react-redux";
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

import { humanReadableDate } from "../../Helpers/Utils";
import { openSnackbar } from "../../Actions/snackbar";

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

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    toggleExtraInfo = () => {
        this.setState({ extraInfoOpen: !this.state.extraInfoOpen });
    };

    render() {
        const { bunqMeTab } = this.props;

        let mainIcon = null;
        switch (bunqMeTab.status) {
            case "WAITING_FOR_PAYMENT":
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

        return [
            <ListItem button onClick={this.toggleExtraInfo}>
                {mainIcon}
                <ListItemText
                    primary={`${bunqMeTab.result_inquiries
                        .length} payments made`}
                    secondary={`Created: ${createdDate}`}
                />
                <ListItemSecondaryAction>
                    <CopyToClipboard
                        text={shareUrl}
                        onCopy={this.copiedValue("the bunq.me tab url")}
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
                {updatedDate !== createdDate ? (
                    <ListItem dense>
                        <ListItemText primary={`Updated: ${expiryDate}`} />
                    </ListItem>
                ) : null}
                <ListItem dense>
                    <ListItemText primary={`Expires: ${expiryDate}`} />
                </ListItem>
                <ListItem style={styles.actionListItem}>
                    <ListItemSecondaryAction>
                        <Button raised color="accent">Cancel tab</Button>
                    </ListItemSecondaryAction>
                </ListItem>
            </Collapse>,
            <Divider />
        ];
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabListItem);

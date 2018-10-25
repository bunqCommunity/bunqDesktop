import React from "react";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Visible from "@material-ui/icons/Visibility";
import VisibleOff from "@material-ui/icons/VisibilityOff";

import BunqMeTabListItem from "./ListItems/BunqMeTabListItem";
import { openSnackbar } from "../Actions/snackbar";
import { bunqMeTabPut } from "../Actions/bunq_me_tab";

const styles = {
    list: {
        textAlign: "left"
    }
};

class BunqMeTabList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showInactiveTabs: false
        };
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    toggleTabVisibility = () => {
        this.setState({ showInactiveTabs: !this.state.showInactiveTabs });
    };

    render() {
        const loadingContent = this.props.bunqMeTabsLoading ? <LinearProgress /> : <Divider />;

        const bunqMeTabs = this.props.bunqMeTabs.map(bunqMeTab => {
            if (this.state.showInactiveTabs === false && bunqMeTab.BunqMeTab.status !== "WAITING_FOR_PAYMENT") {
                return null;
            }
            return (
                <BunqMeTabListItem
                    bunqMeTab={bunqMeTab.BunqMeTab}
                    copiedValue={this.copiedValue}
                    limitedPermissions={this.props.limitedPermissions}
                    bunqMeTabLoading={this.props.bunqMeTabLoading}
                    bunqMeTabsLoading={this.props.bunqMeTabsLoading}
                    bunqMeTabPut={this.props.bunqMeTabPut}
                    BunqJSClient={this.props.BunqJSClient}
                    user={this.props.user}
                />
            );
        });

        return (
            <List style={styles.left}>
                <ListSubheader>
                    bunq.me requests - {bunqMeTabs.length}
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide expired and cancelled bunqme requests"
                            onClick={this.toggleTabVisibility}
                        >
                            {this.state.showInactiveTabs ? <Visible /> : <VisibleOff />}
                        </IconButton>
                        {this.props.secondaryActions}
                    </ListItemSecondaryAction>
                </ListSubheader>
                {loadingContent}
                <List>{bunqMeTabs}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabLoading: state.bunq_me_tab.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        bunqMeTabPut: (userId, accountId, tabId, status) =>
            dispatch(bunqMeTabPut(BunqJSClient, userId, accountId, tabId, status))
    };
};

BunqMeTabList.defaultProps = {
    secondaryActions: null
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BunqMeTabList);

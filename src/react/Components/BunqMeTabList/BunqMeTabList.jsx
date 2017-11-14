import React from "react";
import { connect } from "react-redux";
import List, { ListSubheader, ListItemSecondaryAction } from "material-ui/List";
import { LinearProgress } from "material-ui/Progress";
import Divider from "material-ui/Divider";

import BunqMeTabListItem from "./BunqMeTabListItem";
import { openSnackbar } from "../../Actions/snackbar";
import { bunqMeTabPut } from "../../Actions/bunq_me_tab";

const styles = {
    list: {
        textAlign: "left"
    }
};

class BunqMeTabList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeTabVisible: true
        };
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    render() {
        const loadingContent = this.props.bunqMeTabsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        const bunqMeTabs = this.props.bunqMeTabs.map(bunqMeTab => {
            if (
                this.state.activeTabVisible &&
                bunqMeTab.BunqMeTab.status !== "WAITING_FOR_PAYMENT"
            ) {
                return null;
            }
            return (
                <BunqMeTabListItem
                    bunqMeTab={bunqMeTab.BunqMeTab}
                    copiedValue={this.copiedValue}
                    bunqMeTabPut={this.props.bunqMeTabPut}
                    BunqJSClient={this.props.BunqJSClient}
                    user={this.props.user}
                />
            );
        });

        return (
            <List style={styles.left}>
                <ListSubheader>
                    Bunq.me requests - {bunqMeTabs.length}
                    <ListItemSecondaryAction>
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
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabsLoading: state.bunq_me_tabs.loading
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        bunqMeTabPut: (userId, accountId, tabId, status) =>
            dispatch(
                bunqMeTabPut(BunqJSClient, userId, accountId, tabId, status)
            )
    };
};

BunqMeTabList.defaultProps = {
    secondaryActions: null
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabList);

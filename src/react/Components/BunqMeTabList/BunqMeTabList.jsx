import React from "react";
import { connect } from "react-redux";
import List, { ListSubheader, ListItemSecondaryAction } from "material-ui/List";
import { LinearProgress } from "material-ui/Progress";
import Divider from "material-ui/Divider";

import BunqMeTabListItem from "./BunqMeTabListItem";
import { openSnackbar } from "../../Actions/snackbar";

const styles = {
    list: {
        textAlign: "left"
    }
};

class BunqMeTabList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    render() {
        let loadingContent = this.props.bunqMeTabsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        const bunqMeTabs = this.props.bunqMeTabs.map(bunqMeTab => (
            <BunqMeTabListItem
                bunqMeTab={bunqMeTab.BunqMeTab}
                copiedValue={this.copiedValue}
                BunqJSClient={this.props.BunqJSClient}
            />
        ));

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
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabsLoading: state.bunq_me_tabs.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

BunqMeTabList.defaultProps = {
    secondaryActions: null
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabList);

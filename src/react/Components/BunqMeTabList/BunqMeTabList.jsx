import React from "react";
import { connect } from "react-redux";
import List, { ListSubheader, ListItemSecondaryAction } from "material-ui/List";
import { LinearProgress } from "material-ui/Progress";
import Divider from "material-ui/Divider";

import BunqMeTabListItem from "./BunqMeTabListItem";

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

    render() {
        let loadingContent = this.props.bunqMeTabsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        const bunqMeTabs = this.props.bunqMeTabs.map(bunqMeTab => (
            <BunqMeTabListItem
                bunqMeTab={bunqMeTab.BunqMeTab}
                BunqJSClient={this.props.BunqJSClient}
            />
        ));

        return (
            <List style={styles.left}>
                <ListSubheader>
                    Bunq.me Tabs - {bunqMeTabs.length}
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
    return {};
};

BunqMeTabList.defaultProps = {
    secondaryActions: null
}

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabList);

import React from "react";
import { connect } from "react-redux";
import List, { ListSubheader } from "material-ui/List";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";

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
                bunqMeTab={bunqMeTab}
                BunqJSClient={this.props.BunqJSClient}
            />
        ));

        return (
            <List style={styles.left}>
                <ListSubheader>
                    Bunq.me Tabs - {bunqMeTabs.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabList);

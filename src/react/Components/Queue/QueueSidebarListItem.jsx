import React from "react";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LinearProgress from "@material-ui/core/LinearProgress";

import SyncIcon from "@material-ui/icons/Sync";

import { queueStartSync } from "../../Actions/queue";

const styles = {
    listItemText: {
        padding: 0
    }
};

class QueueSidebarListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            queueLoading,
            queueTriggerSync,
            queueRequestCounter,
            queueMaxRequestCounter
        } = this.props;

        let currentPercentage = 0;
        let secondaryQueueText = t("Queue is empty");
        if (queueLoading) {
            const percentageIncrement = 100 / queueMaxRequestCounter;
            currentPercentage =
                (queueMaxRequestCounter - queueRequestCounter) *
                percentageIncrement;
            secondaryQueueText = `${queueRequestCounter} ${t(
                "requests in queue"
            )}`;
        }

        const clickDisabled = queueLoading || queueTriggerSync;
        const listItemProps = {
            key: "listItem"
        };

        if (clickDisabled === false) {
            listItemProps.button = true;
            listItemProps.onClick = this.props.queueStartSync;
        }

        return (
            <React.Fragment>
                <ListItem {...listItemProps}>
                    <ListItemIcon key="icon">
                        <SyncIcon />
                    </ListItemIcon>
                    <ListItemText
                        key="text"
                        style={styles.listItemText}
                        primary="Background sync"
                        secondary={secondaryQueueText}
                    />
                </ListItem>
                {queueLoading && (
                    <LinearProgress
                        key="progress"
                        variant="determinate"
                        value={currentPercentage}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        queueMaxRequestCounter: state.queue.max_request_counter,
        queueRequestCounter: state.queue.request_counter,
        queueTriggerSync: state.queue.trigger_sync,
        queueLoading: state.queue.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        queueStartSync: () => dispatch(queueStartSync())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QueueSidebarListItem);

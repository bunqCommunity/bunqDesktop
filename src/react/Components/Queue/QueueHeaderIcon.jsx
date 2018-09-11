import React from "react";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";

import SyncIcon from "@material-ui/icons/Sync";

import { queueStartSync } from "../../Actions/queue";

const styles = {};

class QueueHeaderIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            queueLoading,
            queueTriggerSync,
            queueRequestCounter
        } = this.props;

        return (
            <IconButton
                style={this.props.style}
                disabled={queueLoading || queueTriggerSync}
                onClick={this.props.queueStartSync}
            >
                {queueLoading ? (
                    <Badge badgeContent={queueRequestCounter} color="primary">
                        <CircularProgress size={20} />
                    </Badge>
                ) : (
                    <SyncIcon />
                )}
            </IconButton>
        );
    }
}

const mapStateToProps = state => {
    return {
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
)(QueueHeaderIcon);

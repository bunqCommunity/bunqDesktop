import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";

import { formatMoney } from "../../Helpers/Utils";

const styles = {
    paper: {
        padding: 16
    }
};

class EventData extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { t, events, open } = this.props;

        if (this.state.open) console.log(events);

        let change = 0;
        events.map(event => (change += event.info.getDelta()));

        return (
            <Collapse in={open}>
                <Paper style={styles.paper}>
                    <Typography variant={"body1"}>
                        Total change: {formatMoney(change, true)}
                    </Typography>
                </Paper>
            </Collapse>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(EventData)
);

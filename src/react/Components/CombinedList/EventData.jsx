import React from "react";
import { translate } from "react-i18next";
import { withTheme } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";

import IncomingIcon from "@material-ui/icons/KeyboardArrowDown";
import OutgoingIcon from "@material-ui/icons/KeyboardArrowUp";
import ChangeIcon from "@material-ui/icons/CompareArrows";

import { formatMoney } from "../../Helpers/Utils";

const styles = {
    paper: {
        padding: 16
    },
    text: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        margin: 2,
        marginRight: 4
    }
};

class EventData extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { t, theme, events, open } = this.props;

        let change = 0;
        let outGoing = 0;
        let incoming = 0;
        if (open) {
            events.map(event => {
                const delta = event.info.getDelta();
                change += delta;
                if (delta > 0) {
                    incoming += delta;
                } else if (delta < 0) {
                    outGoing += delta;
                }
            });
        }

        return (
            <Collapse in={open}>
                <Paper style={styles.paper}>
                    <Grid container spacing={8} justify={"center"}>
                        <Grid item xs={6} sm={4} style={styles.text}>
                            <ChangeIcon
                                style={{
                                    ...styles.icon,
                                    color: theme.palette.primary.contrastText
                                }}
                            />
                            <Typography variant={"body1"}>
                                Total change: {formatMoney(change, true)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4} style={styles.text}>
                            <IncomingIcon
                                style={{
                                    ...styles.icon,
                                    color: theme.palette.common.receivedPayment
                                }}
                            />
                            <Typography variant={"body1"}>
                                Incoming: {formatMoney(incoming, true)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4} style={styles.text}>
                            <OutgoingIcon
                                style={{
                                    ...styles.icon,
                                    color: theme.palette.common.sentPayment
                                }}
                            />
                            <Typography variant={"body1"}>
                                Outgoing: {formatMoney(outGoing, true)}
                            </Typography>
                        </Grid>
                    </Grid>
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

export default withTheme()(translate("translations")(EventData));

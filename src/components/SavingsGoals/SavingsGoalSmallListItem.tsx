import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import LinearProgressCustom from "../LinearProgress";
import NavLink from "../Routing/NavLink";

const styles = {
    listItem: {
        paddingLeft: 4,
        paddingRight: 4
    },
    progressBar: {
        height: 6
    }
};

const SavingsGoalSmallListItem = props => {
    const { t, savingsGoal, accounts, shareInviteMonetaryAccountResponses } = props;
    const { percentage } = savingsGoal.getStatistics(accounts, shareInviteMonetaryAccountResponses);

    let listItemProps = {
        button: true,
        component: NavLink,
        to: `/savings-goal-page/${savingsGoal.id}`
    };
    if (props.clickDisabled) {
        listItemProps = {};
    }

    return (
        <ListItem {...listItemProps} key={savingsGoal.id} style={styles.listItem}>
            <Grid container>
                <Grid xs={12}>
                    <ListItemText primary={savingsGoal.title} />
                    <ListItemSecondaryAction>
                        <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
                    </ListItemSecondaryAction>
                </Grid>
                <Grid xs={12}>
                    <LinearProgressCustom style={styles.progressBar} color={savingsGoal.color} value={percentage} />
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default SavingsGoalSmallListItem;

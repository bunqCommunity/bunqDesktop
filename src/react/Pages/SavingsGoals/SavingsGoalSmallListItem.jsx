import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import LinearProgressCustom from "../../Components/LinearProgress";

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
    const { savingsGoal, percentage } = props;

    return (
        <ListItem button style={styles.listItem}>
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

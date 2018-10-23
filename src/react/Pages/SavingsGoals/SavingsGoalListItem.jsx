import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { formatMoney, humanReadableDate } from "../../Helpers/Utils";

const styles = {
    listItem: {
        padding: 8
    },
    headerTextsGrid: {
        padding: "4px 22px"
    },
    currentAmountGrid: {
        padding: 8
    },
    currentAmountText: {
        textAlign: "right"
    },
    linearProgressWrapper: {
        display: "flex",
        alignItems: "center"
    },
    linearProgress: {
        width: "100%",
        height: 8
    },
    progressLabels: {
        textAlign: "center"
    }
};

class SavingsGoalListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { t, savingsGoal } = this.props;

        const startValue = 0;
        const currentValue = 20;
        const endValue = savingsGoal.goalAmount;
        const normalise = value => ((value - startValue) * 100) / (endValue - startValue);
        const percentage = currentValue > endValue ? 100 : normalise(currentValue);

        const isExpired = false;
        const startAmount = formatMoney(savingsGoal.getSetting("startAmount") || 0);
        const currentAmount = formatMoney(savingsGoal.goalAmount * 0.7);
        const endAmount = formatMoney(savingsGoal.goalAmount);

        return (
            <Grid item xs={12}>
                <Paper>
                    <ListItem button style={styles.listItem}>
                        <Grid container>
                            <Grid item xs={12} sm={8} md={9} style={styles.headerTextsGrid}>
                                <Typography variant="h5" style={styles.title}>
                                    {savingsGoal.title}
                                </Typography>
                                <Typography variant="body1">{savingsGoal.description}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} style={styles.currentAmountGrid}>
                                <Typography variant="h6" style={styles.currentAmountText}>
                                    {currentAmount}
                                </Typography>
                                <Typography variant="body2" style={styles.currentAmountText}>
                                    {percentage}%
                                </Typography>
                            </Grid>

                            <Grid item xs={4} sm={2} md={1}>
                                <Typography variant="body2" style={styles.progressLabels}>
                                    {startAmount}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={8} md={10} style={styles.linearProgressWrapper}>
                                <LinearProgress
                                    style={styles.linearProgress}
                                    color={isExpired ? "secondary" : "primary"}
                                    variant="determinate"
                                    value={percentage}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2} md={1}>
                                <Typography variant="body2" style={styles.progressLabels}>
                                    {endAmount}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                </Paper>
            </Grid>
        );
    }
}

export default SavingsGoalListItem;

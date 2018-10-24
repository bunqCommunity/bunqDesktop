import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { formatMoney, humanReadableDate } from "../../Helpers/Utils";

const styleOverrides = {
    barColorPrimary: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
    }
};

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
    },
    progressLabelGrid: {
        position: "relative",
        height: 20
    },
    progressLabel: {
        position: "absolute"
    }
};

class SavingsGoalListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    render() {
        const { t, classes, savingsGoal, accounts } = this.props;

        const totalSaved = accounts.reduce((accumulator, account) => {
            if (savingsGoal.accountIds.includes(account.id)) {
                return accumulator + account.getBalance();
            }
            return accumulator;
        }, 0);

        const startValue = savingsGoal.getSetting("startAmount") || 0;
        const currentValue = totalSaved;
        const endValue = savingsGoal.goalAmount;
        const normalise = value => ((value - startValue) * 100) / (endValue - startValue);
        // normalise to 0 or 100 if bigger than end amount or smaller than start amount
        const percentage = currentValue > endValue ? 100 : currentValue < startValue ? 0 : normalise(currentValue);

        const startAmount = formatMoney(startValue);
        const currentAmount = formatMoney(currentValue);
        const endAmount = formatMoney(savingsGoal.goalAmount);

        const minusAmount = percentage < 10 ? 10 : 15;
        const progressLabelStyle = { ...styles.progressLabel, left: `calc(${percentage}% - ${minusAmount}px` };

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
                            </Grid>

                            <Grid item xs={4} sm={2} md={1}>
                                <Typography variant="body2" style={styles.progressLabels}>
                                    {startAmount}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sm={8} md={10} style={styles.linearProgressWrapper}>
                                <LinearProgress
                                    style={styles.linearProgress}
                                    // color={savingsGoals.isExpired ? "secondary" : "primary"}
                                    classes={{
                                        barColorPrimary: classes.barColorPrimary
                                    }}
                                    variant="determinate"
                                    value={percentage}
                                />
                            </Grid>
                            <Grid item xs={4} sm={2} md={1}>
                                <Typography variant="body2" style={styles.progressLabels}>
                                    {endAmount}
                                </Typography>
                            </Grid>

                            <Grid item xs={4} sm={2} md={1} />
                            <Grid item xs={4} sm={8} md={10} style={styles.progressLabelGrid}>
                                <div style={progressLabelStyle}>
                                    <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </ListItem>
                </Paper>
            </Grid>
        );
    }
}

export default withStyles(styleOverrides)(SavingsGoalListItem);

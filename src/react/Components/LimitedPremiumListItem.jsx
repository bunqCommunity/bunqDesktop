import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import LinearProgress from "./LinearProgress";
import { formatMoney } from "../Functions/Utils";

const styles = {
    iconButton: {
        marginRight: 16
    },
    progressBar: {
        height: 6
    },
    progressLabel: {
        marginBottom: 6
    },
    secondaryAction: {
        right: 25,
        top: "39%"
    }
};

export default ({ t, user }) => {
    if (!user || !user.customer_limit || !user.customer_limit.limit_amount_monthly) {
        return null;
    }
    const limitAmountMonthly = parseFloat(user.customer_limit.limit_amount_monthly.value);
    const spentAmountMonthly = parseFloat(user.customer_limit.spent_amount_monthly.value);

    const limitAmountMonthlyLabel = formatMoney(limitAmountMonthly);
    const spentAmountMonthlyLabel = formatMoney(spentAmountMonthly);

    const percentage = (spentAmountMonthly / limitAmountMonthly) * 100;

    return (
        <ListItem>
            <Grid container>
                <Grid xs={12} style={styles.progressLabel}>
                    <ListItemText primary={`${t("Spent this month")}: ${spentAmountMonthlyLabel}`} />
                    <ListItemSecondaryAction style={styles.secondaryAction}>
                        <Typography variant="body1">{limitAmountMonthlyLabel}</Typography>
                    </ListItemSecondaryAction>
                </Grid>
                <Grid xs={12}>
                    <LinearProgress style={styles.progressBar} color="#2196f3" value={percentage} />
                </Grid>
            </Grid>
        </ListItem>
    );
};

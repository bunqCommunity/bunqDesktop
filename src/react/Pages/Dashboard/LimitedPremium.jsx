import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import RefreshIcon from "@material-ui/icons/Refresh";

import LinearProgress from "../../Components/LinearProgress";
import { formatMoney } from "../../Helpers/Utils";

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
        top: "42%"
    }
};

export default ({ t, user, userLoading, userLogin }) => {
    if (!user || !user.customer_limit || !user.customer_limit.limit_amount_monthly) {
        return null;
    }
    const limitAmountMonthly = parseFloat(user.customer_limit.limit_amount_monthly.value);
    const spentAmountMonthly = parseFloat(user.customer_limit.spent_amount_monthly.value);

    const limitAmountMonthlyLabel = formatMoney(limitAmountMonthly);
    const spentAmountMonthlyLabel = formatMoney(spentAmountMonthly);

    const percentage = (spentAmountMonthly / limitAmountMonthly) * 100;

    return (
        <Paper>
            <List>
                <ListItem>
                    <ListItemText primary={limitAmountMonthlyLabel} secondary={t("Limit amount monthly")} />
                    <ListItemSecondaryAction>
                        <IconButton style={styles.iconButton} onClick={userLogin} disabled={userLoading}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                    <ListItemText primary={spentAmountMonthlyLabel} secondary={t("Spent amount monthly")} />
                </ListItem>

                <ListItem>
                    <Grid container>
                        <Grid xs={12} style={styles.progressLabel}>
                            <ListItemText primary={t("Spent of monthly budget")} />
                            <ListItemSecondaryAction style={styles.secondaryAction}>
                                <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
                            </ListItemSecondaryAction>
                        </Grid>
                        <Grid xs={12}>
                            <LinearProgress style={styles.progressBar} color="#2196f3" value={percentage} />
                        </Grid>
                    </Grid>
                </ListItem>
            </List>
        </Paper>
    );
};

import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import { formatMoney } from "../../Functions/Utils";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";

const styles = {
    paper: {
        padding: 16,
        marginTop: 16
    }
};

const BusinessInfo = ({ t, userType, totalBalance, ...props }) => {
    if (userType !== "UserCompany") return null;

    const safeKeepingValue = totalBalance - 100000;
    const hasSafeKeepingFee = safeKeepingValue > 0;

    let costsTable = null;
    if (hasSafeKeepingFee) {
        costsTable = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("Days")}</TableCell>
                        <TableCell numeric>{t("Estimated total cost")}</TableCell>
                        <TableCell numeric>{t("Balance after payments")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 7, 30, 90, 365].map(days => {
                        // to keep track of the amount across the dates
                        let accountBalance = safeKeepingValue;
                        let totalPayment = 0;

                        // go through the days to calculate historic change
                        for (let day = 0; day < days; day++) {
                            const thousands = accountBalance / 1000;
                            let nextPayment = (thousands * 2.4) / 100;

                            // update balance
                            accountBalance = accountBalance - nextPayment;
                            totalPayment = totalPayment + nextPayment;
                        }

                        return (
                            <TableRow key={`days${days}`}>
                                <TableCell component="th" scope="row">
                                    {days}
                                </TableCell>
                                <TableCell numeric>{formatMoney(totalPayment)}</TableCell>
                                <TableCell numeric>{formatMoney(accountBalance)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    return (
        <Paper style={styles.paper}>
            <Grid container spacing={16} justify="center">
                <Grid item xs={12}>
                    <TranslateTypography variant="subtitle1">Safekeeping fee calculator</TranslateTypography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        min={0}
                        step={0.01}
                        type="number"
                        label="Total account balance"
                        value={parseFloat(totalBalance ? totalBalance : 0).toFixed(2)}
                        onChange={props.onChange("totalBalance")}
                    />
                </Grid>

                <Grid item xs={12}>
                    {hasSafeKeepingFee ? (
                        costsTable
                    ) : (
                        <TranslateTypography variant="subtitle1">No safekeeping fee</TranslateTypography>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BusinessInfo;

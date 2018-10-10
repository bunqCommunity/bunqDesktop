import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import SplitAmountItem from "./SplitAmountItem";
import TotalSplitHelper from "./TotalSplitHelper";

const styles = {
    table: {
        width: "100%"
    },
    paper: {
        padding: 24,
        marginBottom: 8,
        textAlign: "left",
        overflowX: "auto"
    },
    titleGrid: { display: "flex", alignItems: "center" }
};

class SplitAmountForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { BunqJSClient, account, targets, splitAmounts, splitRequest, toggleSplitRequest, amount } = this.props;

        if (targets.length === 0) return null;
        if (!amount) return null;

        const totalSplit = TotalSplitHelper(targets, splitAmounts);

        const splitAmountItems = targets.map(target => {
            return (
                <SplitAmountItem
                    target={target}
                    amount={amount}
                    totalSplit={totalSplit}
                    splitAmount={splitAmounts[target.value]}
                    setSplitCount={this.props.setSplitCount}
                />
            );
        });

        return (
            <Paper style={styles.paper}>
                <Grid container spacing={8}>
                    <Grid item xs={12} style={styles.titleGrid}>
                        <Switch checked={splitRequest} onChange={toggleSplitRequest} />

                        <TranslateTypography variant={"title"}>Split request</TranslateTypography>
                    </Grid>
                    {splitRequest ? (
                        <Grid item xs={12}>
                            <Divider />
                            <Table style={styles.table}>
                                <TableBody>
                                    <SplitAmountItem
                                        BunqJSClient={BunqJSClient}
                                        account={account}
                                        amount={amount}
                                        totalSplit={totalSplit}
                                        splitAmount={splitAmounts.account}
                                        setSplitCount={this.props.setSplitCount}
                                    />
                                    {splitAmountItems}
                                </TableBody>
                            </Table>
                        </Grid>
                    ) : null}
                </Grid>
            </Paper>
        );
    }
}

export default SplitAmountForm;

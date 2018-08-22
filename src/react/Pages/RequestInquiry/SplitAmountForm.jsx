import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import SplitAmountItem from "./SplitAmountItem";

const styles = {
    table: {
        width: "100%"
    }
};

class SplitAmountForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            BunqJSClient,
            account,
            targets,
            splitAmounts,
            amount
        } = this.props;

        if (targets.length === 0) return null;
        if (!amount) return null;

        // get split from the personal account
        const accountSplit =
            typeof splitAmounts.account !== "undefined"
                ? splitAmounts.account
                : 1;

        // get the total split amount from all other targets
        const splitAmountsTotal = targets.reduce((accumulator, target) => {
            // check if this target already has a custom split amount
            if (typeof splitAmounts[target.value] !== "undefined") {
                // add the total amount
                return accumulator + splitAmounts[target.value];
            }
            return accumulator + 1;
        }, 0);
        const totalSplit = splitAmountsTotal + accountSplit;

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
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <TranslateTypography variant={"subheading"}>
                        Define shares
                    </TranslateTypography>
                </Grid>
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
            </Grid>
        );
    }
}

export default SplitAmountForm;

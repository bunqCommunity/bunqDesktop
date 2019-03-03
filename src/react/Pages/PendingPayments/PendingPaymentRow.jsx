import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";

import TargetChipList from "../../Components/FormFields/TargetChipList";
import TargetChip from "../../Components/FormFields/TargetChip";

import { formatMoney } from "../../Functions/Utils";

const styles = {
    subdirectoryIconGrid: {
        display: "flex",
        justifyContent: "center",
        width: 52
    },
    deleteIconTableCell: {
        width: 48
    },
    amountTableCell: {
        width: 100,
        padding: "4px 24px 4px 24px"
    },
    checkTableBoxCell: {
        width: 48
    }
};

export default ({ pendingPayment, selectedCheckBoxes, accounts, togglePaymentCheckBox, removePayment }) => {
    const paymentObject = pendingPayment.payment;

    let targetComponents = null;
    if (paymentObject.counterparty_aliases) {
        targetComponents = <TargetChipList targets={paymentObject.counterparty_aliases} accounts={accounts} />;
    } else {
        targetComponents = <TargetChip target={paymentObject.counterparty_alias} accounts={accounts} />;
    }

    return (
        <TableRow key={pendingPayment.id}>
            <TableCell padding="checkbox" style={styles.checkTableBoxCell}>
                <Checkbox
                    color="primary"
                    checked={!!selectedCheckBoxes[pendingPayment.id]}
                    onChange={togglePaymentCheckBox(pendingPayment.id)}
                />
            </TableCell>
            <TableCell style={styles.amountTableCell}>
                <Typography>{formatMoney(paymentObject.amount.value)}</Typography>
            </TableCell>
            <TableCell>
                <Grid container alignItems="center">
                    <Grid style={styles.subdirectoryIconGrid}>
                        <SubdirectoryArrowRightIcon />
                    </Grid>
                    <Grid item>{targetComponents}</Grid>
                </Grid>
            </TableCell>
            <TableCell style={styles.deleteIconTableCell}>
                <IconButton onClick={removePayment(pendingPayment.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

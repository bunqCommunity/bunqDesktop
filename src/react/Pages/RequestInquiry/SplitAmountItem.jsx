import React from "react";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { formatMoney } from "../../Helpers/Utils";

import AccountListItemChip from "../../Components/AccountList/AccountListItemChip";

const styles = {
    chip: {
        margin: 5
    },
    tableRow: {},
    buttons: {
        display: "flex"
    },
    splitAmountLabel: {
        fontSize: 15,
        paddingLeft: 8,
        paddingRight: 8
    },
    previewAmountLabel: {
        fontSize: 15
    },
    percentageLabel: {
        fontSize: 13,
        marginLeft: 6
    }
};

class SplitAmountItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    addSplit = () => {
        let { account, target, splitAmount } = this.props;

        // default to 1 and add number
        splitAmount = typeof splitAmount !== "undefined" ? splitAmount + 1 : 2;

        if (account) {
            this.props.setSplitCount("account", splitAmount);
        } else {
            this.props.setSplitCount(target.value, splitAmount);
        }
    };

    removeSplit = () => {
        let { account, target, splitAmount } = this.props;

        // default to 1
        splitAmount = typeof splitAmount !== "undefined" ? splitAmount : 1;

        // if personal account, share can be 0 else it has to be atleast 1
        const minimumSplit = account ? 0 : 1;

        // prevent negative values
        splitAmount = splitAmount - 1 <= 0 ? minimumSplit : splitAmount - 1;

        if (account) {
            this.props.setSplitCount("account", splitAmount);
        } else {
            this.props.setSplitCount(target.value, splitAmount);
        }
    };

    render() {
        const { BunqJSClient, account, target, splitAmount, totalSplit, amount } = this.props;

        const splitAmountValue = typeof splitAmount !== "undefined" ? splitAmount : 1;

        let targetInfo = null;
        if (account) {
            targetInfo = <AccountListItemChip BunqJSClient={BunqJSClient} account={account} />;
        } else {
            let Icon = null;
            switch (target.type) {
                case "EMAIL":
                case "PHONE":
                case "CONTACT":
                    Icon = PersonIcon;
                    break;
                case "TRANSFER":
                    Icon = CompareArrowsIcon;
                    break;
                default:
                case "IBAN":
                    Icon = AccountBalanceIcon;
                    break;
            }

            targetInfo = (
                <Chip
                    style={styles.chip}
                    avatar={
                        <Avatar>
                            <Icon color="primary" />
                        </Avatar>
                    }
                    label={target.value}
                />
            );
        }

        const percentage = totalSplit > 0 ? splitAmountValue / totalSplit : 0;
        const prettyPercentage = (percentage * 100).toFixed(2);
        const moneyAmount = amount * percentage;

        return (
            <TableRow style={styles.tableRow}>
                <TableCell>{targetInfo}</TableCell>
                <TableCell>
                    <span style={styles.previewAmountLabel}>{formatMoney(moneyAmount)}</span>
                    <span style={styles.percentageLabel}>{prettyPercentage}%</span>
                </TableCell>
                <TableCell style={styles.buttons}>
                    <IconButton onClick={this.removeSplit}>
                        <RemoveIcon />
                    </IconButton>
                    <p style={styles.splitAmountLabel}>{splitAmountValue}x</p>
                    <IconButton onClick={this.addSplit}>
                        <AddIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
}

export default SplitAmountItem;
